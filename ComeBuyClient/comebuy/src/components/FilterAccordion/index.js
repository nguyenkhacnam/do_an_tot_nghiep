import * as React from 'react';
import { useEffect, useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, CircularProgress, Stack } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SplitFeatureFromList } from './function';
import { ConstructionOutlined } from '@mui/icons-material';
import productAPI from '../../api/productAPI';
const CheckBoxList = (props) => {
    const [checkedBox, setCheckedBox] = useState([])
    const handleCheck = (value) => {
        checkedBox.includes(value) ? setCheckedBox(prev => prev.filter(item => item != value)) :
            setCheckedBox(prev => [...prev, value])
    }
    useEffect(() => {
        props.handleFilter({name: props.featureName, option: checkedBox})
    }, [checkedBox])
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            {props.values.length > 0 && props.values.map((item, i) => (
                <FormControlLabel
                    sx={{ m: 1 }}
                    key={i}
                    label={item}
                    control={<Checkbox checked={checkedBox.includes(item)} onChange={() => handleCheck(item)} color="secondary" />}
                />
            ))}
        </Box>
    )
};

const FilterAccordion = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [brandOptions, setBrandOptions] = useState({ loading: false, options: [] })
    const [ramOptions, setRAMOptions] = useState({ loading: false, options: [] })
    const [cpuOptions, setCPUOptions] = useState({ loading: false, options: [] })
    const [gpuOptions, setGPUOptions] = useState({ loading: false, options: [] })
    const [screenDimensionOptions, setScreenDimensionOptions] = useState({ loading: false, options: [] })
    const [weightOptions, setWeightOptions] = useState({ loading: false, options: [] })
    const [memoryOptions, setMemoryOptions] = useState({ loading: false, options: [] })
    const [yearOptions, setYearOptions] = useState({ loading: false, options: [] })
    const [featureFilter, setFeatureFilter] = useState([
        { featureName: 'Brand', option: brandOptions },
        { featureName: 'RAM', option: ramOptions },
        { featureName: 'CPU', option: cpuOptions },
        { featureName: 'GPU', option: gpuOptions },
        { featureName: 'Screen Dimension', option: screenDimensionOptions },
        { featureName: 'Weight', option: weightOptions },
        { featureName: 'Memory', option: memoryOptions },
        { featureName: 'Year', option: yearOptions }
    ])
    useEffect(async () => {
        const response = await productAPI.getProductFilterOptions()
        if (response.status == 200)
        await SplitFeatureFromList(
                    response.data,
                    setBrandOptions,
                    setRAMOptions,
                    setCPUOptions,
                    setGPUOptions,
                    setScreenDimensionOptions,
                    setWeightOptions,
                    setMemoryOptions,
                    setYearOptions
                )
        else console.log('Load Feature Failed')
    }, [])


    useEffect(() => {
        setFeatureFilter([
            { featureName: 'Brand', option: brandOptions },
            { featureName: 'RAM', option: ramOptions },
            { featureName: 'CPU', option: cpuOptions },
            { featureName: 'GPU', option: gpuOptions },
            { featureName: 'ScreenDimension', option: screenDimensionOptions },
            { featureName: 'Weight', option: weightOptions },
            { featureName: 'Memory', option: memoryOptions },
            { featureName: 'Year', option: yearOptions }
        ])
    }, [brandOptions, 
        ramOptions, 
        cpuOptions, 
        gpuOptions, 
        screenDimensionOptions, 
        weightOptions, 
        memoryOptions,
        yearOptions
    ])


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div>
            {
                featureFilter.map((item, i) => (
                    <Accordion key={i} expanded={expanded === item.featureName} onChange={handleChange(item.featureName)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                {item.featureName}
                            </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                            {item.option.loading ?
                                <Stack sx={{ width: '100%' }}>
                                    <CheckBoxList values={item.option.option} featureName={item.featureName} handleFilter={props.handleFilter} />
                                </Stack> :
                                <Stack direction={'row'} sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }} spacing={2}>
                                    <CircularProgress sx={{ width: '100%', alignSelf: 'center' }} color="secondary" />
                                    <Typography variant='body1' color={'secondary'}> Loading...</Typography>
                                </Stack>
                            }
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </div>
    );
}
export default FilterAccordion