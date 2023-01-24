import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import Highcharts from "highcharts";

const chartColors = [
    "#5454d4",
    "#9c27b0",
    "#ff9800",
    "#e91e63",
    "#4caf50",
    "#f44336",
];

const CircularProgressBar = () => {
    const varData = [
        {
            "id": 10327,
            "code": "1000",
            "weight": 0.293795,
            "audience_id": 7857
        }
        // ,
        // {
        //     "id": 10328,
        //     "code": "FEMALE",
        //     "weight": 0.706205,
        //     "audience_id": 7857
        // }
    ]

    function TotalDataFun() {
        return varData.map((gender) => {
          return [gender.code, gender.weight];
        });
      }
    const totalData = () => {
        return {
            color: chartColors,
            chart: {
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0,
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                type: 'pie',
                height: '65%'
            },
            title: {
                text: `Total rows`,
                align: "center",
                style: {
                    fontSize: "15px",
                    fontWeight: "600",
                    display: "none",
                },
                verticalAlign: "middle",
                y: 80,
            },
            tooltip: {
                pointFormat: "{series.name}- <b>{point.name}</b>",
                style: {
                    fontSize: "10px",
                },
            },
            // accessibility: {
            //     point: {
            //         valueSuffix: "%",
            //     },
            // },
            plotOptions: {
                pie: {
                    size: '100%',
                    dataLabels: {
                        enabled: true,
                        //format: "<b>{point.name}</b><br>{point.percentage:.1f} %",
                        format: "<b>{point.name}</b><br>",
                        distance: -70,
                        style: {
                            fontWeight: "bold",
                            fontSize: "15px",
                            color: "#333333",
                            
                        },
                    },
                    startAngle: -360,
                    endAngle: 360,
                },
            },
            series: [
                {
                    type: "pie",
                    name: "Total rows",
                    innerSize: "80%",
                    data: TotalDataFun(),
                },
            ],
        }
    }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={totalData()}
            />
        </>
    )
}

export default CircularProgressBar