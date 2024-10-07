import React from 'react'
import Topic from '../../components/Topic.jsx';

function MachineLearning() {
  const topics = [
    { path: "/introduction", label: "Introduction to Machine Learning", subject:"Machine Learning" },
    { path: "/data-preprocessing", label: "Data Preprocessing", subject:"Machine Learning" },
    { path: "/supervised-learning", label: "Supervised Learning", subject:"Machine Learning" },
    { path: "/linear-regression", label: "Linear Regression", subject:"Machine Learning" },
    { path: "/logistic-regression", label: "Logistic Regression", subject:"Machine Learning" },
    { path: "/decision-trees", label: "Decision Trees", subject:"Machine Learning" },
    { path: "/random-forest", label: "Random Forest", subject:"Machine Learning" },
    { path: "/svm", label: "Support Vector Machines (SVM)", subject:"Machine Learning" },
    { path: "/naive-bayes", label: "Naive Bayes", subject:"Machine Learning" },
    { path: "/k-nearest-neighbors", label: "K-Nearest Neighbors (KNN)", subject:"Machine Learning" },
    { path: "/unsupervised-learning", label: "Unsupervised Learning", subject:"Machine Learning" },
    { path: "/clustering", label: "Clustering (e.g., K-Means)", subject:"Machine Learning" },
    { path: "/dimensionality-reduction", label: "Dimensionality Reduction (e.g., PCA)", subject:"Machine Learning" },
    { path: "/model-evaluation", label: "Model Evaluation and Validation", subject:"Machine Learning" },
    { path: "/hyperparameter-tuning", label: "Hyperparameter Tuning", subject:"Machine Learning" },
    { path: "/deployment", label: "Model Deployment", subject:"Machine Learning" },
  ];

  return (
    <div>
      <Topic topics={topics} />
    </div>
  );
}

export default MachineLearning;