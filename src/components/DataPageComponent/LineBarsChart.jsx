import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from "highcharts";

const LineBarsChart = () => {
    const chartColors = [
        "#5454d4",
        "#9c27b0",
        "#ff9800",
        "#e91e63",
        "#4caf50",
        "#f44336",
    ];

    const BarArray = [
        {
            "id": 30985,
            "code": "Jan",
            "weight": 0.039318,
        },
        {
            "id": 30986,
            "code": "Fab",
            "weight": 0.39318,
        },
        {
            "id": 30987,
            "code": "Mar",
            "weight": 0.49318,
        },
        {
            "id": 30989,
            "code": "Apr",
            "weight": 0.13318,
        },
        {
            "id": 30990,
            "code": "May",
            "weight": 0.139318,
        },
        {
            "id": 30991,
            "code": "Jun",
            "weight": 0.269318,
        },
        {
            "id": 30992,
            "code": "Jul",
            "weight": 0.639318,
        },
        {
            "id": 30993,
            "code": "Aug",
            "weight": 0.539318,
        },
        {
            "id": 30994,
            "code": "Sep",
            "weight": 0.79318,
        },
        {
            "id": 30995,
            "code": "Oct",
            "weight": 0.339318,
        },
        {
            "id": 30996,
            "code": "Nov",
            "weight": 0.259318,
        },
        {
            "id": 30997,
            "code": "Dec",
            "weight": 0.45678,
        }
    ]

    function getDataCal() {
        return BarArray.map((gdata) => {
            return [gdata.code, gdata.weight * 100];
        });
    }

    const totalBars = () => {
        return {
            colors: chartColors,
            chart: {
                type: "column",
                height: '24%'
            },
            title: {
                style: {
                    display: "none",
                },
            },
            subtitle: {
                style: {
                    display: "none",
                },
            },
            xAxis: {
                type: "category",
                labels: {
                    style: {
                        fontSize: "10px",
                        fontFamily: "arial",
                    },
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Percentage %",
                    style: {
                        fontSize: "10px",
                    },
                },
            },
            legend: {
                enabled: false,
            },
            tooltip: {
                pointFormat: "Percentage <b>{point.y:.1f}%</b>",
                style: {
                    fontSize: "10px",
                },
            },
            series: [
                {
                    name: "Data Split",
                    data: getDataCal(),
                    pointWidth: 12,
                    dataLabels: {
                       // enabled: true,
                        color: "#FFFFFF",
                        align: "center",
                        format: "{point.y:.1f}",
                        style: {
                         fontSize: "8px",
                         fontFamily: "arial",
                         fontWeight:"bold"
                        },
                    },
                },
            ],
        };
    }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={totalBars()}
            />
            
        </>
    )
}

export default LineBarsChart