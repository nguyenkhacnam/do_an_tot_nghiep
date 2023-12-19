const db = require("../models");
const Feature = db.feature;
const Product = db.product;
const Stock = db.stock;
const ProductImage = db.productimage;
const Comment = db.comment;
const Op = db.Sequelize.Op;
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const SendResponse = require("../utils/SendResponse");
const SendBroadCast = require("../utils/SendBroadCast");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
// Create and Save a new Product
exports.create = catchAsync(async (req, res, next) => {
  // Validate request
  if (!req.body.name || !req.body.memory) {
    next(
      AppError(
        {
          message: "Content can not be empty!",
        },
        400
      )
    );
    return;
  }
  // Create a Product
  const product = {
    ram: req.body.ram,
    memory: req.body.memory,
    gpu: req.body.gpu,
    cpu: req.body.cpu,
    name: req.body.name,
    brand: req.body.brand,
    description: req.body.description,
    weight: req.body.weight,
    origin: req.body.origin,
    screenDimension: req.body.screenDimension,
    colorCoverage: req.body.colorCoverage,
    price: req.body.price,
    externalIOPort: req.body.externalIOPort,
    battery: req.body.battery,
    warranty: req.body.warranty,
    promotion: req.body.promotion,
    year: req.body.year,
    // isPublished: false,
    // keyIndex: req.body.keyIndex
  };


  // Save Product in the database
  const data = await Product.create(product);
  if (data) {
    SendBroadCast({
      proxy: process.env.WEBSOCKET,
      body: { destination: "update-new-product", data: data },
    });
    SendResponse(data, 200, res);
  } else
    next(
      new AppError(
        {
          message:
            err.message || "Some error occurred while creating the Product.",
        },
        500
      )
    );
});
// Retrieve all Products from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;
  Product.findAll({
    include: [
      {
        model: Feature,
        as: "feature",
        attributes: ["featureID", "name"],
        through: {
          attributes: [],
        },
      },
      {
        model: ProductImage,
        as: "productimage",
        attributes: ["imageURL", "productImageID"],
      },
      {
        model: Comment,
        as: "comment",
        attributes: ["userid", "body"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products.",
      });
    });
};
// Find a single Product with an id
exports.findOne = catchAsync(async (req, res) => {
  const id = req.params.id;
  // const statusRes = await sequelize.query(
  //   "CALL up_GetStatusOfProduct(:productid,null)",
  //   {
  //     replacements: { productid: id },
  //     type: QueryTypes.SELECT,
  //     raw: true,
  //   }
  // );
  Product.findByPk(id, {
    include: [
      {
        model: Feature,
        as: "feature",
        attributes: ["featureid", "name"],
        through: {
          attributes: [],
        },
      },
      {
        model: ProductImage,
        as: "productimage",
        attributes: ["imageURL", "productImageID"],
      },
      {
        model: Comment,
        as: "comment",
        attributes: ["userid", "body"],
      },
    ],
  })
    .then((data) => {
      if (data) {
        // data.dataValues["status"] = statusRes[0].rs;
        SendResponse(data, 200, res);
      } else {
        res.status(404).send({
          message: `Cannot find Product with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Product with id=" + id + err,
      });
    });
});
// Update a Product by the id in the request
exports.update = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = await Product.update(req.body, {
    where: { productID: id },
  }).catch((err) => {
    next(new AppError("Error updating Product with id=" + id, 500));
  });
  if (data == 1) SendResponse("Product was updated successfully.", 200, res);
  else
    return next(
      new AppError(
        `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
        400
      )
    );
});
// Delete a Product with the specified id in the request
exports.delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log("🚀 ~ file: product.controller.js:175 ~ exports.delete ~ id:", id)
  try {
    await Stock.destroy({
      where: { productid: id }
    });
    const num = await Product.destroy({
      where: { productid: id },
    });
    console.log("🚀 ~ file: product.controller.js:180 ~ exports.delete ~ num:", num)
    if (num && num == 1) {
      SendResponse({ message: "Product was deleted successfully!" }, 200, res);
    } else
      next(
        new AppError(
          {
            message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
          },
          404
        )
      );
  } catch (e) {
    next(
      new AppError(
        {
          message: `Error` + e,
        },
        500
      )
    );
    console.log(e);
  }
});
// Delete all Products from the database.
exports.deleteAll = (req, res) => {
  Product.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Products were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Products.",
      });
    });
};
// Find all published Products
exports.findAllPublished = (req, res) => {
  Product.findAll({ where: { official: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Products.",
      });
    });
};

exports.addFeature = catchAsync(async (req, res, next) => {
  const productId = req.params.productId;
  const featureId = req.params.featureId;
  const prd = await Product.findByPk(productId).catch((err) => {
    return next(
      new AppError(">> Error while adding Product to Feature: " + err, 500)
    );
  });

  if (!prd) {
    return next(new AppError("Product not found!", 404));
  }
  return Feature.findByPk(featureId).then((feature) => {
    if (!feature) {
      return next(new AppError("Product not found!", 404));
    }
    prd.addFeature(feature);
    SendResponse(
      `>> added Product id=${prd.productID} to Feature id=${feature.featureID}`,
      200,
      res
    );
  });
});

exports.deleteAndUpdateFeature = catchAsync(async (req, res, next) => {
  console.log('check jwt')
  const productId = req.body.productID;
  const featureId = req.body.featureID;
  const prd = await Product.findByPk(productId).catch((err) => {
    return next(new AppError(">> Error while finding Product: " + err, 500));
  });

  if (!prd) {
    return next(new AppError("Product not found!", 404));
  }
  await prd.setFeature(featureId);
  SendResponse(
    `>> update Product id=${prd.productID} to Feature successfully`,
    200,
    res
  );
});

exports.ChangeIsPublished = catchAsync(async (req, res, next) => {
  const productId = req.body.productID;
  const prd = await Product.findByPk(productId).catch((err) => {
    return next(new AppError(">> Error while finding Product: " + err, 500));
  });

  if (!prd) {
    return next(new AppError("Product not found!", 404));
  }
  await prd.setFeature(featureId);
  SendResponse(
    `>> update Product id=${prd.productID} to Feature successfully`,
    200,
    res
  );
});

exports.filter = catchAsync(async (req, res, next) => {
  const {
    brand,
    cpu,
    gpu,
    memory,
    prices,
    ram,
    screendimension,
    weight,
    year,
    demand,
    offset,
  } = req.body;
    console.log("🚀 ~ file: product.controller.js:312 ~ exports.filter=catchAsync ~ year:", year)
  console.log('req.body', req.body, brand)
  const result = await Product.findAll().then(async (rs) => {
    // console.log("🚀 ~ file: product.controller.js:314 ~ result ~ rs:", rs)
    let brands = rs.map((item) => {
      console.log('itemmmm', item.brand)
      return item.brand});
      console.log('kekekeekekekekekek', brand.length)
    var brandOptions =
    brand.length > 0 ? brand : brands.filter((v, i, a) => a.indexOf(v) === i);
    // cpu
    console.log("🚀 ~ file: product.controller.js:320 ~ result ~ brandOptions:", brandOptions)
    let cpus = rs.map((item) => item.cpu);
    var cpuOptions =
      cpu.length > cpu ? cpu : cpus.filter((v, i, a) => a.indexOf(v) === i);
    // gpu
    let gpus = rs.map((item) => item.gpu);
    var gpuOptions =
      gpu.length > 0 ? gpu : gpus.filter((v, i, a) => a.indexOf(v) === i);
    //ram
    let rams = rs.map((item) => item.ram);
    var ramOptions =
      ram.length > 0 ? ram : rams.filter((v, i, a) => a.indexOf(v) === i);
    //screen dimension
    let screenDimensions = rs.map((item) => item.screenDimension);
    var SDOptions =
      screendimension.length > 0
        ? screendimension
        : screenDimensions.filter((v, i, a) => a.indexOf(v) === i);
    //weight
    let weights = rs.map((item) => item.weight);
    var weightOptions =
      weight.length > 0
        ? weight
        : weights.filter((v, i, a) => a.indexOf(v) === i);
    //memory
    let memories = rs.map((item) => item.memory);
    var memoryOptions =
      memory.length > 0
        ? memory
        : memories.filter((v, i, a) => a.indexOf(v) === i);
    // year
    let years = rs.map((item) => item.year);
    var yearOptions =
      year.length > 0 ? year : years.filter((v, i, a) => a.indexOf(v) === i);

    // let query = `select 
    //         array_agg(DISTINCT a.productid) as records
    //          from
    //         (select t1.* , array_agg(DISTINCT t3.name) as listFeature
    //         from product t1 full join product_feature t2 on t1.productid = t2.productid 
    //         inner join feature t3 on t2.featureid = t3.featureid
    //         where 
    //         brand in (:brand) and 
    //         cpu in (:cpu) and
    //         gpu in (:gpu) and
    //         screendimension in (:screendimension) and
    //         weight in (:weight) and
    //         memory in (:memory) and
    //         year in (:year) and 
    //         ram in (:ram) and
    //         ispublished = true and
    //         price between :minPrice and :maxPrice
    //         group by t1.productid) a
    //         where a.listFeature @>`;

    let query = `select 
      array_agg(DISTINCT a.productid) as records
      from
      (select t1.* , array_agg(DISTINCT t3.name) as listFeature
      from product t1 full join product_feature t2 on t1.productid = t2.productid 
      inner join feature t3 on t2.featureid = t3.featureid
      where 
      brand in (:brand) and 
      cpu in (:cpu) and
      gpu in (:gpu) and
      screendimension in (:screendimension) and
      weight in (:weight) and
      memory in (:memory) and
      year in (:year) and 
      ram in (:ram) and
      price between :minPrice and :maxPrice
      group by t1.productid) a
      where a.listFeature @>`
      ;
    let query2 = "";
    demand.map((item) => (query2 = query2 + item + ","));
    query2 = query2.slice(0, query2.length - 1);
    query2 = `'{${query2}}' `;
    const index = (offset - 1) * 9;
    query = query + query2;
    console.log("🚀 ~ file: product.controller.js:376 ~ result ~ query:", query)
    const response = await sequelize.query(query, {
      replacements: {
        brand: brandOptions,
        cpu: cpuOptions,
        gpu: gpuOptions,
        ram: ramOptions,
        memory: memoryOptions,
        year: yearOptions,
        minPrice: prices[0],
        maxPrice: prices[1],
        weight: weightOptions,
        screendimension: SDOptions,
      },
      type: QueryTypes.SELECT,
    });
    console.log("🚀 ~ file: product.controller.js:391 ~ result ~ response:", brandOptions,
    cpuOptions,
    gpuOptions,
    ramOptions,
    memoryOptions,
    yearOptions,
    weightOptions,
    SDOptions,
    )
    console.log("🚀 ~ file: product.controller.js:391 ~ result ~ response:11111111111111111111111111111", response
    )

    let response_2 = [];
    console.log(response[0].records);
    if (response[0].records != null && response[0].records.length > 0) {
      response_2 = await Product.findAll({
        where: {
          productID: response[0].records.slice(index, index + 9),
        },
        include: [
          {
            model: Feature,
            as: "feature",
            attributes: ["featureID", "name"],
            through: {
              attributes: [],
            },
          },
          {
            model: ProductImage,
            as: "productimage",
            attributes: ["imageURL", "productImageID"],
          },
          {
            model: Comment,
            as: "comment",
            attributes: ["userid", "body"],
          },
        ],
      });
    }
    console.log('response_2', response_2)
    SendResponse(
      {
        total: response[0].records != null ? response[0].records.length : 0,
        data: response_2,
      },
      200,
      res
    );
  });
});
exports.getAllFeature = catchAsync(async (req, res, next) => {
  await Product.findAll()
    .then((rs) => {
      let brands = rs.map((item) => item.brand);
      var brandOptions = brands.filter((v, i, a) => a.indexOf(v) === i);
      // cpu
      let cpus = rs.map((item) => item.cpu);
      var cpuOptions = cpus.filter((v, i, a) => a.indexOf(v) === i);
      // gpu
      let gpus = rs.map((item) => item.gpu);
      var gpuOptions = gpus.filter((v, i, a) => a.indexOf(v) === i);
      //ram
      let rams = rs.map((item) => item.ram);
      var ramOptions = rams.filter((v, i, a) => a.indexOf(v) === i);
      //screen dimension
      let screenDimensions = rs.map((item) => item.screenDimension);
      var SDOptions = screenDimensions.filter((v, i, a) => a.indexOf(v) === i);
      //weight
      let weights = rs.map((item) => item.weight);
      var weightOptions = weights.filter((v, i, a) => a.indexOf(v) === i);
      //memory
      let memories = rs.map((item) => item.memory);
      var memoryOptions = memories.filter((v, i, a) => a.indexOf(v) === i);
      // year
      let years = rs.map((item) => item.year);
      var yearOptions = years.filter((v, i, a) => a.indexOf(v) === i);

      SendResponse(
        {
          brandOptions: brandOptions,
          cpuOptions: cpuOptions,
          gpuOptions: gpuOptions,
          ramOptions: ramOptions,
          SDOptions: SDOptions,
          weightOptions: weightOptions,
          memoryOptions: memoryOptions,
          yearOptions: yearOptions,
        },
        200,
        res
      );
    })
    .catch((err) => {
      return next(
        new AppError(
          `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
          400
        )
      );
    });
});

exports.getBestSellingProduct = catchAsync(async (req, res, next) => {
  const query = `
    select 
    sum(amount), productid as productID
    from invoiceitem
    group by productid
    order by sum desc
    fetch first 5 rows only
    `;
  const response = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (response) {
    SendResponse(response, 200, res);
  } else
    next(
      new AppError(
        {
          message:
            err.message || "Some error occurred while creating the Product.",
        },
        500
      )
    );
});
