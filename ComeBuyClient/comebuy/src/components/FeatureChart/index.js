import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { featureListSelector } from '../../redux/selectors';
import { getAllFeature } from '../../redux/slices/featureSlice';

const no_feature = [
    {
        subject: 'Thin-Light',
        A: 0,
        B: 0,
        fullMark: 160,
    },
    {
        subject: 'Gaming',
        A: 0,
        B: 0,
        fullMark: 160,
    },
    {
        subject: 'Office',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: 'Coder',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: 'Study',
        A: 0,
        B: 0,
        fullMark: 150,
    },
    {
        subject: 'Other',
        A: 0,
        B: 0,
        fullMark: 150,
    }



];


const FeatureChart = (props) => {
    const featureList = useSelector(featureListSelector)
    const dispatch = useDispatch()
    if (featureList.length == 0)
    {
        dispatch(getAllFeature())
    }
    const convertData = (featureProduct) => {
        const res = []

        if (featureProduct.length == 0) {
            return no_feature
        }
        else {
            for (let i = 0; i < featureProduct.length; i++)
                res.push({
                    subject: featureProduct[i],
                    A: 150,
                    B: 150,
                    fullMark: 160,
                })
            for (let j = 0; j < featureList.length; j++)
                if (!featureProduct.includes(featureList[j].name))
                    res.push({
                        subject: featureList[j].name,
                        A: 0,
                        B: 0,
                        fullMark: 160,
                    })
        }
        return res
    }
   

    return (
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={convertData(props.data)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                {/* <PolarRadiusAxis /> */}
                <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    );

}
export default FeatureChart;
