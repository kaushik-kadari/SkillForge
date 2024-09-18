import React from 'react'
import Carousel from "../../components/Carousel.jsx";
import { Link } from 'react-router-dom';
import { ImFire } from 'react-icons/im';
import { useEffect,useState } from 'react';
import Topic from '../../components/Topic.jsx';

function MachineLearning() {
  const topics = [
    { path: "/introduction", label: "Introduction to Machine Learning" },
    { path: "/data-preprocessing", label: "Data Preprocessing" },
    { path: "/supervised-learning", label: "Supervised Learning" },
    { path: "/linear-regression", label: "Linear Regression" },
    { path: "/logistic-regression", label: "Logistic Regression" },
    { path: "/decision-trees", label: "Decision Trees" },
    { path: "/random-forest", label: "Random Forest" },
    { path: "/svm", label: "Support Vector Machines (SVM)" },
    { path: "/naive-bayes", label: "Naive Bayes" },
    { path: "/k-nearest-neighbors", label: "K-Nearest Neighbors (KNN)" },
    { path: "/unsupervised-learning", label: "Unsupervised Learning" },
    { path: "/clustering", label: "Clustering (e.g., K-Means)" },
    { path: "/dimensionality-reduction", label: "Dimensionality Reduction (e.g., PCA)" },
    { path: "/model-evaluation", label: "Model Evaluation and Validation" },
    { path: "/hyperparameter-tuning", label: "Hyperparameter Tuning" },
    { path: "/deployment", label: "Model Deployment" }
  ];

  return (
    <div>
      <Topic topics={topics} />
    </div>
  );
}

export default MachineLearning;