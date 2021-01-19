import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import React, { useMemo } from "react";

interface Line {
    name: string;
    data: Array<[number, number]>;
    axis?: number;
    hidden?: boolean;
}

const colors = [
    "#006FE8",
    "#99B898",
    "#FECEAB",
    "#FF847C",
    "#E84A5F",
    "#A8E6CE",
    "#DCEDC2",
    "#FFD3B5",
    "#FFAAA6",
    "#FF8C94 ",
];

/**
 * DOCS: https://api.highcharts.com/highstock/
 */
const getOptions = (seriesData: Line[]) => ({
    rangeSelector: {
        // selected: 1
        enabled: false,
    },
    navigator: {
        enabled: false,
    },
    scrollbar: {
        enabled: false,
    },

    legend: {
        enabled: false,
        itemStyle: {
            color: "white",
        },
        itemHoverStyle: {
            color: "#aaa",
        },
    },

    chart: {
        backgroundColor: null,
        height: "100%",
    },

    yAxis: Array.from(
        new Array(
            seriesData.reduce(
                (acc, data) => Math.max(acc, (data.axis || 0) + 1),
                1,
            ),
        ),
    ).map((_) => ({
        gridLineColor: "#1A2E46",
        opposite: false,
        labels: {
            enabled: true,
            style: {
                color: "white",
            },
        },
    })),

    xAxis: [
        {
            lineColor: null,
            labels: {
                style: {
                    color: "white",
                },
            },
        },
    ],

    series: seriesData.map(({ name, data, axis, hidden }, i) => ({
        name,
        data,
        color: colors[i % colors.length],
        yAxis: axis || 0,
        visible: !hidden,
        lineWidth: 3,
    })),
});

interface Props {
    lines: Array<Line | undefined>;
}

export const Graph: React.FC<Props> = ({ lines }) => {
    const options = useMemo(
        () => getOptions(lines.filter((line) => line !== undefined) as Line[]),
        [lines],
    );

    return (
        <div className="highcharts--with-outside-tooltip">
            <div
                className="overview--chart--canvas"
                style={{ maxWidth: "100%" }}
            >
                <HighchartsReact
                    className={"highcharts--outer"}
                    highcharts={Highcharts}
                    constructorType={"stockChart"}
                    options={options}
                />
            </div>
        </div>
    );
};
