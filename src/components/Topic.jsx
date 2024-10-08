import React from "react";
import { Link } from "react-router-dom";
import Content from "./Content";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Topic() {
  const { subject } = useParams();
  // console.log(subject);
  const navigate = useNavigate();
  const renderContent = (topic, subject) => {
    // console.log(topic);
    navigate("/content/" + subject + "/" + topic);
  }

  const topics = {
    cplusplus: {
        sub : 
        [{ path: "/cplusplus/datatypes", label: "Data Types" },
        { path: "/cplusplus/variables", label: "Variables" },
        { path: "/cplusplus/operators", label: "Operators" },
        { path: "/cplusplus/control_structures", label: "Control Structures" },
        { path: "/cplusplus/functions", label: "Functions" },
        { path: "/cplusplus/arrays", label: "Arrays" },
        { path: "/cplusplus/pointers", label: "Pointers" },
        { path: "/cplusplus/structures", label: "Structures" },
        { path: "/cplusplus/file_handling", label: "File Handling" },
        { path: "/cplusplus/exception_handling", label: "Exception Handling" },
        { path: "/cplusplus/object_oriented_programming", label: "Object Oriented Programming" },
        { path: "/cplusplus/templates", label: "Templates" },
        { path: "/cplusplus/standard_template_library", label: "Standard Template Library" },
        { path: "/cplusplus/exceptions", label: "Exceptions" },
        { path: "/cplusplus/rtti", label: "RTTI" },
        { path: "/cplusplus/multithreading", label: "Multithreading" }
        ],
    },
    java: {
        sub : 
        [{ path: "/java/datatypes", label: "Data Types" },
        { path: "/java/variables", label: "Variables" },
        { path: "/java/operators", label: "Operators" },
        { path: "/java/control_structures", label: "Control Structures" },
        { path: "/java/functions", label: "Functions" },
        { path: "/java/arrays", label: "Arrays" },
        { path: "/java/pointers", label: "Pointers" },
        { path: "/java/structures", label: "Structures" },
        { path: "/java/file_handling", label: "File Handling" },
        { path: "/java/exception_handling", label: "Exception Handling" },
        { path: "/java/classes", label: "Classes" },
        { path: "/java/objects", label: "Objects" },
        { path: "/java/inheritance", label: "Inheritance" },
        { path: "/java/polymorphism", label: "Polymorphism" },
        { path: "/java/encapsulation", label: "Encapsulation" },
        { path: "/java/abstraction", label: "Abstraction" },
        { path: "/java/interface", label: "Interface" },
        { path: "/java/package", label: "Package" },
        { path: "/java/exception", label: "Exception" },
        { path: "/java/multithreading", label: "Multithreading" }],
    },
    c: {
      sub: [
        { path: "/c/datatypes", label: "Data Types" },
        { path: "/c/variables", label: "Variables" },
        { path: "/c/operators", label: "Operators" },
        { path: "/c/control_structures", label: "Control Structures" },
        { path: "/c/functions", label: "Functions" },
        { path: "/c/arrays", label: "Arrays" },
        { path: "/c/pointers", label: "Pointers" },
        { path: "/c/structures", label: "Structures" },
        { path: "/c/file_handling", label: "File Handling" },
        { path: "/c/exception_handling", label: "Exception Handling" },
        { path: "/c/preprocessor", label: "Preprocessor" },
        { path: "/c/memory_management", label: "Memory Management" },
        { path: "/c/recursion", label: "Recursion" },
        { path: "/c/linked_lists", label: "Linked Lists" },
        { path: "/c/stacks", label: "Stacks" },
        { path: "/c/queues", label: "Queues" },
        { path: "/c/sorting", label: "Sorting" },
        { path: "/c/searching", label: "Searching" },
        { path: "/c/multithreading", label: "Multithreading" },
      ],
    },
    csharp: {
      sub: [
        { path: "/csharp/datatypes", label: "Data Types" },
        { path: "/csharp/variables", label: "Variables" },
        { path: "/csharp/operators", label: "Operators" },
        { path: "/csharp/control_structures", label: "Control Structures" },
        { path: "/csharp/functions", label: "Functions" },
        { path: "/csharp/arrays", label: "Arrays" },
        { path: "/csharp/pointers", label: "Pointers" },
        { path: "/csharp/classes", label: "Classes" },
        { path: "/csharp/objects", label: "Objects" },
        { path: "/csharp/inheritance", label: "Inheritance" },
        { path: "/csharp/polymorphism", label: "Polymorphism" },
        { path: "/csharp/interfaces", label: "Interfaces" },
        { path: "/csharp/exceptions", label: "Exception Handling" },
        { path: "/csharp/async_programming", label: "Async Programming" },
        { path: "/csharp/linq", label: "LINQ" },
        { path: "/csharp/delegates", label: "Delegates" },
        { path: "/csharp/events", label: "Events" },
        { path: "/csharp/generics", label: "Generics" },
        { path: "/csharp/multithreading", label: "Multithreading" },
      ],
    },
    go: {
      sub: [
        { path: "/go/datatypes", label: "Data Types" },
        { path: "/go/variables", label: "Variables" },
        { path: "/go/operators", label: "Operators" },
        { path: "/go/control_structures", label: "Control Structures" },
        { path: "/go/functions", label: "Functions" },
        { path: "/go/arrays", label: "Arrays" },
        { path: "/go/pointers", label: "Pointers" },
        { path: "/go/structures", label: "Structures" },
        { path: "/go/interfaces", label: "Interfaces" },
        { path: "/go/goroutines", label: "Goroutines" },
        { path: "/go/channels", label: "Channels" },
        { path: "/go/error_handling", label: "Error Handling" },
        { path: "/go/packages", label: "Packages" },
        { path: "/go/concurrency", label: "Concurrency" },
        { path: "/go/slices", label: "Slices" },
        { path: "/go/maps", label: "Maps" },
        { path: "/go/io_operations", label: "IO Operations" },
        { path: "/go/reflection", label: "Reflection" },
      ],
    },
    javascript: {
      sub: [
        { path: "/javascript/variables", label: "Variables" },
        { path: "/javascript/datatypes", label: "Data Types" },
        { path: "/javascript/functions", label: "Functions" },
        { path: "/javascript/objects", label: "Objects" },
        { path: "/javascript/arrays", label: "Arrays" },
        { path: "/javascript/closures", label: "Closures" },
        { path: "/javascript/promises", label: "Promises" },
        { path: "/javascript/async_await", label: "Async/Await" },
        { path: "/javascript/event_loop", label: "Event Loop" },
        { path: "/javascript/dom_manipulation", label: "DOM Manipulation" },
        { path: "/javascript/prototypes", label: "Prototypes" },
        { path: "/javascript/classes", label: "Classes" },
        { path: "/javascript/modules", label: "Modules" },
        { path: "/javascript/error_handling", label: "Error Handling" },
        { path: "/javascript/event_handling", label: "Event Handling" },
        { path: "/javascript/functional_programming", label: "Functional Programming" },
        { path: "/javascript/es6_features", label: "ES6 Features" },
      ],
    },
    kotlin: {
      sub: [
        { path: "/kotlin/datatypes", label: "Data Types" },
        { path: "/kotlin/variables", label: "Variables" },
        { path: "/kotlin/functions", label: "Functions" },
        { path: "/kotlin/classes", label: "Classes" },
        { path: "/kotlin/objects", label: "Objects" },
        { path: "/kotlin/inheritance", label: "Inheritance" },
        { path: "/kotlin/null_safety", label: "Null Safety" },
        { path: "/kotlin/lambdas", label: "Lambdas" },
        { path: "/kotlin/collections", label: "Collections" },
        { path: "/kotlin/coroutines", label: "Coroutines" },
        { path: "/kotlin/error_handling", label: "Error Handling" },
        { path: "/kotlin/sealed_classes", label: "Sealed Classes" },
        { path: "/kotlin/generics", label: "Generics" },
        { path: "/kotlin/interfaces", label: "Interfaces" },
        { path: "/kotlin/smart_casts", label: "Smart Casts" },
      ],
    },
    php: {
      sub: [
        { path: "/php/datatypes", label: "Data Types" },
        { path: "/php/variables", label: "Variables" },
        { path: "/php/operators", label: "Operators" },
        { path: "/php/functions", label: "Functions" },
        { path: "/php/arrays", label: "Arrays" },
        { path: "/php/strings", label: "Strings" },
        { path: "/php/file_handling", label: "File Handling" },
        { path: "/php/forms", label: "Forms" },
        { path: "/php/sessions", label: "Sessions" },
        { path: "/php/cookies", label: "Cookies" },
        { path: "/php/oop", label: "Object-Oriented Programming (OOP)" },
        { path: "/php/exceptions", label: "Exception Handling" },
        { path: "/php/namespaces", label: "Namespaces" },
        { path: "/php/traits", label: "Traits" },
        { path: "/php/composer", label: "Composer" },
        { path: "/php/databases", label: "Working with Databases" },
      ],
    },
    python: {
      sub: [
        { path: "/python/datatypes", label: "Data Types" },
        { path: "/python/variables", label: "Variables" },
        { path: "/python/operators", label: "Operators" },
        { path: "/python/control_structures", label: "Control Structures" },
        { path: "/python/functions", label: "Functions" },
        { path: "/python/arrays", label: "Arrays" },
        { path: "/python/loops", label: "Loops" },
        { path: "/python/classes", label: "Classes" },
        { path: "/python/modules", label: "Modules" },
        { path: "/python/file_handling", label: "File Handling" },
        { path: "/python/exceptions", label: "Exception Handling" },
        { path: "/python/generators", label: "Generators" },
        { path: "/python/iterators", label: "Iterators" },
        { path: "/python/lambdas", label: "Lambda Functions" },
        { path: "/python/regex", label: "Regular Expressions" },
        { path: "/python/oop", label: "Object-Oriented Programming" },
        { path: "/python/multithreading", label: "Multithreading" },
        { path: "/python/multiprocessing", label: "Multiprocessing" },
        { path: "/python/asyncio", label: "Asyncio" },
        { path: "/python/machine_learning", label: "Machine Learning" },
      ],
    },
    ruby: {
      sub: [
        { path: "/ruby/datatypes", label: "Data Types" },
        { path: "/ruby/variables", label: "Variables" },
        { path: "/ruby/operators", label: "Operators" },
        { path: "/ruby/control_structures", label: "Control Structures" },
        { path: "/ruby/functions", label: "Functions" },
        { path: "/ruby/classes", label: "Classes" },
        { path: "/ruby/modules", label: "Modules" },
        { path: "/ruby/blocks", label: "Blocks" },
        { path: "/ruby/iterators", label: "Iterators" },
        { path: "/ruby/arrays", label: "Arrays" },
        { path: "/ruby/hashes", label: "Hashes" },
        { path: "/ruby/oop", label: "Object-Oriented Programming" },
        { path: "/ruby/exceptions", label: "Exception Handling" },
        { path: "/ruby/metaprogramming", label: "Metaprogramming" },
        { path: "/ruby/file_handling", label: "File Handling" },
      ],
    },
    swift: {
      sub: [
        { path: "/swift/datatypes", label: "Data Types" },
        { path: "/swift/variables", label: "Variables" },
        { path: "/swift/constants", label: "Constants" },
        { path: "/swift/control_structures", label: "Control Structures" },
        { path: "/swift/functions", label: "Functions" },
        { path: "/swift/closures", label: "Closures" },
        { path: "/swift/optionals", label: "Optionals" },
        { path: "/swift/arrays", label: "Arrays" },
        { path: "/swift/dictionaries", label: "Dictionaries" },
        { path: "/swift/loops", label: "Loops" },
        { path: "/swift/structs", label: "Structs" },
        { path: "/swift/classes", label: "Classes" },
        { path: "/swift/protocols", label: "Protocols" },
        { path: "/swift/error_handling", label: "Error Handling" },
        { path: "/swift/extensions", label: "Extensions" },
        { path: "/swift/generics", label: "Generics" },
        { path: "/swift/multithreading", label: "Multithreading" },
      ],
    },
    typescript: {
      sub: [
        { path: "/typescript/datatypes", label: "Data Types" },
        { path: "/typescript/variables", label: "Variables" },
        { path: "/typescript/functions", label: "Functions" },
        { path: "/typescript/interfaces", label: "Interfaces" },
        { path: "/typescript/classes", label: "Classes" },
        { path: "/typescript/generics", label: "Generics" },
        { path: "/typescript/modules", label: "Modules" },
        { path: "/typescript/union_types", label: "Union Types" },
        { path: "/typescript/tuples", label: "Tuples" },
        { path: "/typescript/advanced_types", label: "Advanced Types" },
        { path: "/typescript/error_handling", label: "Error Handling" },
        { path: "/typescript/enums", label: "Enums" },
        { path: "/typescript/decorators", label: "Decorators" },
        { path: "/typescript/multithreading", label: "Multithreading" },
        { path: "/typescript/asynchronous_programming", label: "Asynchronous Programming" },
      ],
    },
    aptitude: {
        sub : [
          { path: "/problems-on-trains", label: "Problems on Trains" , subject:"Aptitude"},
          { path: "/time-and-distance", label: "Time and Distance", subject:"Aptitude" },
          { path: "/height-and-distance", label: "Height and Distance", subject:"Aptitude" },
          { path: "/time-and-work", label: "Time and Work", subject:"Aptitude" },
          { path: "/simple-interest", label: "Simple Interest", subject:"Aptitude" },
          { path: "/compound-interest", label: "Compound Interest", subject:"Aptitude" },
          { path: "/profit-and-loss", label: "Profit and Loss", subject:"Aptitude" },
          { path: "/partnership", label: "Partnership", subject:"Aptitude" },
          { path: "/percentage", label: "Percentage", subject:"Aptitude" },
          { path: "/problems-on-ages", label: "Problems on Ages", subject:"Aptitude" },
          { path: "/calendar", label: "Calendar", subject:"Aptitude" },
          { path: "/clock", label: "Clock", subject:"Aptitude" },
          { path: "/average", label: "Average", subject:"Aptitude" },
          { path: "/area", label: "Area", subject:"Aptitude" },
          { path: "/volume-and-surface-area", label: "Volume and Surface Area", subject:"Aptitude" },
          { path: "/permutation-and-combination", label: "Permutation and Combination", subject:"Aptitude" },
          { path: "/numbers", label: "Numbers", subject:"Aptitude" },
          { path: "/problems-on-numbers", label: "Problems on Numbers", subject:"Aptitude" },
          { path: "/hcf-and-lcm", label: "Problems on H.C.F and L.C.M", subject:"Aptitude" },
          { path: "/decimal-fraction", label: "Decimal Fraction", subject:"Aptitude" },
          { path: "/simplification", label: "Simplification", subject:"Aptitude" },
          { path: "/square-root-and-cube-root", label: "Square Root and Cube Root", subject:"Aptitude" },
          { path: "/surds-and-indices", label: "Surds and Indices", subject:"Aptitude" },
          { path: "/ratio-and-proportion", label: "Ratio and Proportion", subject:"Aptitude" },
          { path: "/chain-rule", label: "Chain Rule", subject:"Aptitude" },
          { path: "/pipes-and-cistern", label: "Pipes and Cistern", subject:"Aptitude" },
          { path: "/boats-and-streams", label: "Boats and Streams", subject:"Aptitude" },
          { path: "/alligation-or-mixture", label: "Alligation or Mixture", subject:"Aptitude" },
          { path: "/logarithm", label: "Logarithm", subject:"Aptitude" },
          { path: "/races-and-games", label: "Races and Games", subject:"Aptitude" },
          { path: "/stocks-and-shares", label: "Stocks and Shares", subject:"Aptitude" },
          { path: "/probability", label: "Probability", subject:"Aptitude" },
          { path: "/true-discount", label: "True Discount", subject:"Aptitude" },
          { path: "/bankers-discount", label: "Banker's Discount", subject:"Aptitude" }
        ]
    },
    "machine Learning": {
        sub : [
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
        ]
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-3 gap-10 p-10 flex flex-col">
      <div className="text-center bg-[#ebe7de5b] p-2 rounded-md shadow-lg border">
        <h1 className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2">
          Topics
        </h1>
        <div className="flex flex-col md:space-y-12 space-y-8 my-5 max-h-[60vh] overflow-y-scroll">
          {topics[subject].sub?.map((topic, index) => (
            <p key={index} className="text-xl text-center cursor-pointer" onClick={() => renderContent(topic.label, subject)}>{topic.label}</p>
          ))}
        </div>
      </div>

      <div className="text-center bg-[#ebe7de5b] p-2 rounded-md shadow-lg border col-span-2">
        <h1 className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2" >
          Short Notes
        </h1>
      </div>
    </div>
    // <></>
  );
}

export default Topic;
