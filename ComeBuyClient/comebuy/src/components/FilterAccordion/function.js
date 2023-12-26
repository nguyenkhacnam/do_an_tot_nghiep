// const SplitFeatureFromList = async (product, setBrand, setRAM, setCPU, setGPU, setScreenDimension, setWeight, setMemory, setYear) => {
//     // brand
//     let brands = product.map(item => item.brand)
//     var brandOptions = brands.filter((v, i, a) => a.indexOf(v) === i); 
//     setBrand({loading : true, option : brandOptions})
//     // cpu
//     let cpus = product.map(item => item.cpu)
//     var cpuOptions = cpus.filter((v, i, a) => a.indexOf(v) === i); 
//     setCPU({loading : true, option : cpuOptions})
//     // gpu
//     let gpus = product.map(item => item.gpu)
//     var gpuOptions = gpus.filter((v, i, a) => a.indexOf(v) === i); 
//     setGPU({loading : true, option : gpuOptions})
//     //ram
//     let rams = product.map(item => item.ram)
//     var ramOptions = rams.filter((v, i, a) => a.indexOf(v) === i); 
//     setRAM({loading : true, option : ramOptions})
//     //screen dimension
//     let screenDimensions = product.map(item => item.screenDimension)
//     var SDOptions = screenDimensions.filter((v, i, a) => a.indexOf(v) === i); 
//     setScreenDimension({loading : true, option : SDOptions})
//     //weight
//     let weights = product.map(item => item.weight)
//     var weightOptions = weights.filter((v, i, a) => a.indexOf(v) === i); 
//     setWeight({loading : true, option : weightOptions})
//     //memory
//     let memories = product.map(item => item.memory)
//     var memoryOptions = memories.filter((v, i, a) => a.indexOf(v) === i); 
//     setMemory({loading : true, option : memoryOptions})
//     // year
//     let years = product.map(item => item.year)
//     var yearOptions = years.filter((v, i, a) => a.indexOf(v) === i); 
//     setYear({loading : true, option : yearOptions})

//     return true
// }
const SplitFeatureFromList = async (features, setBrand, setRAM, setCPU, setGPU, setScreenDimension, setWeight, setMemory, setYear) => {
    console.log('features', features);
    setCPU({loading : true, option : features.cpuOptions})
    // brand
    setBrand({loading : true, option : features.brandOptions})
    // cpu
    setGPU({loading : true, option : features.gpuOptions})
    //ram
    setRAM({loading : true, option : features.ramOptions})
    //screen dimension
    setScreenDimension({loading : true, option : features.SDOptions})
    //weight
    setWeight({loading : true, option : features.weightOptions})
    //memory
    setMemory({loading : true, option : features.memoryOptions})
    // year
    setYear({loading : true, option : features.yearOptions})
    return true
}

export {SplitFeatureFromList}