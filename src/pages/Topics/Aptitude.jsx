import React from 'react'
import Carousel from "../../components/Carousel.jsx";
import { Link } from 'react-router-dom';
import { ImFire } from 'react-icons/im';
import { useEffect,useState } from 'react';
import Topic from '../../components/Topic.jsx';

function Aptitude() {
  const topics = [
            { path: "/problems-on-trains", label: "Problems on Trains" },
            { path: "/time-and-distance", label: "Time and Distance" },
            { path: "/height-and-distance", label: "Height and Distance" },
            { path: "/time-and-work", label: "Time and Work" },
            { path: "/simple-interest", label: "Simple Interest" },
            { path: "/compound-interest", label: "Compound Interest" },
            { path: "/profit-and-loss", label: "Profit and Loss" },
            { path: "/partnership", label: "Partnership" },
            { path: "/percentage", label: "Percentage" },
            { path: "/problems-on-ages", label: "Problems on Ages" },
            { path: "/calendar", label: "Calendar" },
            { path: "/clock", label: "Clock" },
            { path: "/average", label: "Average" },
            { path: "/area", label: "Area" },
            { path: "/volume-and-surface-area", label: "Volume and Surface Area" },
            { path: "/permutation-and-combination", label: "Permutation and Combination" },
            { path: "/numbers", label: "Numbers" },
            { path: "/problems-on-numbers", label: "Problems on Numbers" },
            { path: "/hcf-and-lcm", label: "Problems on H.C.F and L.C.M" },
            { path: "/decimal-fraction", label: "Decimal Fraction" },
            { path: "/simplification", label: "Simplification" },
            { path: "/square-root-and-cube-root", label: "Square Root and Cube Root" },
            { path: "/surds-and-indices", label: "Surds and Indices" },
            { path: "/ratio-and-proportion", label: "Ratio and Proportion" },
            { path: "/chain-rule", label: "Chain Rule" },
            { path: "/pipes-and-cistern", label: "Pipes and Cistern" },
            { path: "/boats-and-streams", label: "Boats and Streams" },
            { path: "/alligation-or-mixture", label: "Alligation or Mixture" },
            { path: "/logarithm", label: "Logarithm" },
            { path: "/races-and-games", label: "Races and Games" },
            { path: "/stocks-and-shares", label: "Stocks and Shares" },
            { path: "/probability", label: "Probability" },
            { path: "/true-discount", label: "True Discount" },
            { path: "/bankers-discount", label: "Banker's Discount" }
          ];

  return (
    <div>
      <Topic topics={topics} />
    </div>
  );
}

export default Aptitude;