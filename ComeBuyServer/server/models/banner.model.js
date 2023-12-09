module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define("banner", {
        bannerID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'bannerid',
        },
        url: {
            type: Sequelize.STRING(512),
            field: 'url',
        },
    },
        {
            freezeTableName: true,

            timestamps: false,

            createdAt: false,

            updatedAt: false,
        });
        return Banner;
};