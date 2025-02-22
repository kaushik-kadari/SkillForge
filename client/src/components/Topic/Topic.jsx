import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Content from "../Content/Content";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getTasks } from "../../services/contentService";
import { useAuth } from "../../services/AuthService";
import { HiBadgeCheck } from "react-icons/hi";

function Topic() {
  const { subject } = useParams();
  // console.log(subject);
  const navigate = useNavigate();
  const location = useLocation();
  const renderContent = (topic, subject, id) => {
    // console.log(topic);
    navigate("/content/" + subject + "/" + topic + "/" + id + "/content");
  }
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [shortNotes, setShortNotes] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      if (user.email) { 
        try {
          const res = await getTasks(user.email);
          // console.log(res);
          setTasks(res.tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchTasks(); 

  }, [user.email]);

  const checkTask = (topic, subject) => {
    // console.log(subject + "-" + topic);
    // console.log(tasks);
    if(!tasks) return false;
    return tasks.includes(subject + "-" + topic);
  }

  const topics = {
    cplusplus: {
        sub : 
        [{ id: 7, path: "/cplusplus/datatypes", label: "Data Types" },
        { id: 7, path: "/cplusplus/variables", label: "Variables" },
        { id: 7, path: "/cplusplus/operators", label: "Operators" },
        { id: 7, path: "/cplusplus/control_structures", label: "Control Structures" },
        { id: 7, path: "/cplusplus/functions", label: "Functions" },
        { id: 7, path: "/cplusplus/arrays", label: "Arrays" },
        { id: 7, path: "/cplusplus/pointers", label: "Pointers" },
        { id: 7, path: "/cplusplus/structures", label: "Structures" },
        { id: 7, path: "/cplusplus/file_handling", label: "File Handling" },
        { id: 7, path: "/cplusplus/exception_handling", label: "Exception Handling" },
        { id: 7, path: "/cplusplus/object_oriented_programming", label: "Object Oriented Programming" },
        { id: 7, path: "/cplusplus/templates", label: "Templates" },
        { id: 7, path: "/cplusplus/standard_template_library", label: "Standard Template Library" },
        { id: 7, path: "/cplusplus/exceptions", label: "Exceptions" },
        { id: 7, path: "/cplusplus/rtti", label: "RTTI" },
        { id: 7, path: "/cplusplus/multithreading", label: "Multithreading" }
        ],
    },
    java: {
        sub : 
        [{ id: 10, path: "/java/datatypes", label: "Data Types" },
        { id: 10, path: "/java/variables", label: "Variables" },
        { id: 10, path: "/java/operators", label: "Operators" },
        { id: 10, path: "/java/control_structures", label: "Control Structures" },
        { id: 10, path: "/java/functions", label: "Functions" },
        { id: 10, path: "/java/arrays", label: "Arrays" },
        { id: 10, path: "/java/pointers", label: "Pointers" },
        { id: 10, path: "/java/structures", label: "Structures" },
        { id: 10, path: "/java/file_handling", label: "File Handling" },
        { id: 10, path: "/java/exception_handling", label: "Exception Handling" },
        { id: 10, path: "/java/classes", label: "Classes" },
        { id: 10, path: "/java/objects", label: "Objects" },
        { id: 10, path: "/java/inheritance", label: "Inheritance" },
        { id: 10, path: "/java/polymorphism", label: "Polymorphism" },
        { id: 10, path: "/java/encapsulation", label: "Encapsulation" },
        { id: 10, path: "/java/abstraction", label: "Abstraction" },
        { id: 10, path: "/java/interface", label: "Interface" },
        { id: 10, path: "/java/package", label: "Package" },
        { id: 10, path: "/java/exception", label: "Exception" },
        { id: 10, path: "/java/multithreading", label: "Multithreading" }],
    },
    c: {
      sub: [
        { id: 6, path: "/c/datatypes", label: "Data Types" },
        { id: 6, path: "/c/variables", label: "Variables" },
        { id: 6, path: "/c/operators", label: "Operators" },
        { id: 6, path: "/c/control_structures", label: "Control Structures" },
        { id: 6, path: "/c/functions", label: "Functions" },
        { id: 6, path: "/c/arrays", label: "Arrays" },
        { id: 6, path: "/c/pointers", label: "Pointers" },
        { id: 6, path: "/c/structures", label: "Structures" },
        { id: 6, path: "/c/file_handling", label: "File Handling" },
        { id: 6, path: "/c/exception_handling", label: "Exception Handling" },
        { id: 6, path: "/c/preprocessor", label: "Preprocessor" },
        { id: 6, path: "/c/memory_management", label: "Memory Management" },
        { id: 6, path: "/c/recursion", label: "Recursion" },
        { id: 6, path: "/c/linked_lists", label: "Linked Lists" },
        { id: 6, path: "/c/stacks", label: "Stacks" },
        { id: 6, path: "/c/queues", label: "Queues" },
        { id: 6, path: "/c/sorting", label: "Sorting" },
        { id: 6, path: "/c/searching", label: "Searching" },
        { id: 6, path: "/c/multithreading", label: "Multithreading" },
      ],
    },
    csharp: {
      sub: [
        { id: 8, path: "/csharp/datatypes", label: "Data Types" },
        { id: 8, path: "/csharp/variables", label: "Variables" },
        { id: 8, path: "/csharp/operators", label: "Operators" },
        { id: 8, path: "/csharp/control_structures", label: "Control Structures" },
        { id: 8, path: "/csharp/functions", label: "Functions" },
        { id: 8, path: "/csharp/arrays", label: "Arrays" },
        { id: 8, path: "/csharp/pointers", label: "Pointers" },
        { id: 8, path: "/csharp/classes", label: "Classes" },
        { id: 8, path: "/csharp/objects", label: "Objects" },
        { id: 8, path: "/csharp/inheritance", label: "Inheritance" },
        { id: 8, path: "/csharp/polymorphism", label: "Polymorphism" },
        { id: 8, path: "/csharp/interfaces", label: "Interfaces" },
        { id: 8, path: "/csharp/exceptions", label: "Exception Handling" },
        { id: 8, path: "/csharp/async_programming", label: "Async Programming" },
        { id: 8, path: "/csharp/linq", label: "LINQ" },
        { id: 8, path: "/csharp/delegates", label: "Delegates" },
        { id: 8, path: "/csharp/events", label: "Events" },
        { id: 8, path: "/csharp/generics", label: "Generics" },
        { id: 8, path: "/csharp/multithreading", label: "Multithreading" },
      ],
    },
    go: {
      sub: [
        { id: 9, path: "/go/datatypes", label: "Data Types" },
        { id: 9, path: "/go/variables", label: "Variables" },
        { id: 9, path: "/go/operators", label: "Operators" },
        { id: 9, path: "/go/control_structures", label: "Control Structures" },
        { id: 9, path: "/go/functions", label: "Functions" },
        { id: 9, path: "/go/arrays", label: "Arrays" },
        { id: 9, path: "/go/pointers", label: "Pointers" },
        { id: 9, path: "/go/structures", label: "Structures" },
        { id: 9, path: "/go/interfaces", label: "Interfaces" },
        { id: 9, path: "/go/goroutines", label: "Goroutines" },
        { id: 9, path: "/go/channels", label: "Channels" },
        { id: 9, path: "/go/error_handling", label: "Error Handling" },
        { id: 9, path: "/go/packages", label: "Packages" },
        { id: 9, path: "/go/concurrency", label: "Concurrency" },
        { id: 9, path: "/go/slices", label: "Slices" },
        { id: 9, path: "/go/maps", label: "Maps" },
        { id: 9, path: "/go/io_operations", label: "IO Operations" },
        { id: 9, path: "/go/reflection", label: "Reflection" },
      ],
    },
    javascript: {
      sub: [
        { id: 11, path: "/javascript/variables", label: "Variables" },
        { id: 11, path: "/javascript/datatypes", label: "Data Types" },
        { id: 11, path: "/javascript/functions", label: "Functions" },
        { id: 11, path: "/javascript/objects", label: "Objects" },
        { id: 11, path: "/javascript/arrays", label: "Arrays" },
        { id: 11, path: "/javascript/closures", label: "Closures" },
        { id: 11, path: "/javascript/promises", label: "Promises" },
        { id: 11, path: "/javascript/async_await", label: "Async/Await" },
        { id: 11, path: "/javascript/event_loop", label: "Event Loop" },
        { id: 11, path: "/javascript/dom_manipulation", label: "DOM Manipulation" },
        { id: 11, path: "/javascript/prototypes", label: "Prototypes" },
        { id: 11, path: "/javascript/classes", label: "Classes" },
        { id: 11, path: "/javascript/modules", label: "Modules" },
        { id: 11, path: "/javascript/error_handling", label: "Error Handling" },
        { id: 11, path: "/javascript/event_handling", label: "Event Handling" },
        { id: 11, path: "/javascript/functional_programming", label: "Functional Programming" },
        { id: 11, path: "/javascript/es6_features", label: "ES6 Features" },
      ],
    },
    kotlin: {
      sub: [
        { id: 12, path: "/kotlin/datatypes", label: "Data Types" },
        { id: 12, path: "/kotlin/variables", label: "Variables" },
        { id: 12, path: "/kotlin/functions", label: "Functions" },
        { id: 12, path: "/kotlin/classes", label: "Classes" },
        { id: 12, path: "/kotlin/objects", label: "Objects" },
        { id: 12, path: "/kotlin/inheritance", label: "Inheritance" },
        { id: 12, path: "/kotlin/null_safety", label: "Null Safety" },
        { id: 12, path: "/kotlin/lambdas", label: "Lambdas" },
        { id: 12, path: "/kotlin/collections", label: "Collections" },
        { id: 12, path: "/kotlin/coroutines", label: "Coroutines" },
        { id: 12, path: "/kotlin/error_handling", label: "Error Handling" },
        { id: 12, path: "/kotlin/sealed_classes", label: "Sealed Classes" },
        { id: 12, path: "/kotlin/generics", label: "Generics" },
        { id: 12, path: "/kotlin/interfaces", label: "Interfaces" },
        { id: 12, path: "/kotlin/smart_casts", label: "Smart Casts" },
      ],
    },
    php: {
      sub: [
        { id: 13, path: "/php/datatypes", label: "Data Types" },
        { id: 13, path: "/php/variables", label: "Variables" },
        { id: 13, path: "/php/operators", label: "Operators" },
        { id: 13, path: "/php/functions", label: "Functions" },
        { id: 13, path: "/php/arrays", label: "Arrays" },
        { id: 13, path: "/php/strings", label: "Strings" },
        { id: 13, path: "/php/file_handling", label: "File Handling" },
        { id: 13, path: "/php/forms", label: "Forms" },
        { id: 13, path: "/php/sessions", label: "Sessions" },
        { id: 13, path: "/php/cookies", label: "Cookies" },
        { id: 13, path: "/php/oop", label: "Object-Oriented Programming (OOP)" },
        { id: 13, path: "/php/exceptions", label: "Exception Handling" },
        { id: 13, path: "/php/namespaces", label: "Namespaces" },
        { id: 13, path: "/php/traits", label: "Traits" },
        { id: 13, path: "/php/composer", label: "Composer" },
        { id: 13, path: "/php/databases", label: "Working with Databases" },
      ],
    },
    python: {
      sub: [
        { id: 14, path: "/python/datatypes", label: "Data Types" },
        { id: 14, path: "/python/variables", label: "Variables" },
        { id: 14, path: "/python/operators", label: "Operators" },
        { id: 14, path: "/python/control_structures", label: "Control Structures" },
        { id: 14, path: "/python/functions", label: "Functions" },
        { id: 14, path: "/python/arrays", label: "Arrays" },
        { id: 14, path: "/python/loops", label: "Loops" },
        { id: 14, path: "/python/classes", label: "Classes" },
        { id: 14, path: "/python/modules", label: "Modules" },
        { id: 14, path: "/python/file_handling", label: "File Handling" },
        { id: 14, path: "/python/exceptions", label: "Exception Handling" },
        { id: 14, path: "/python/generators", label: "Generators" },
        { id: 14, path: "/python/iterators", label: "Iterators" },
        { id: 14, path: "/python/lambdas", label: "Lambda Functions" },
        { id: 14, path: "/python/regex", label: "Regular Expressions" },
        { id: 14, path: "/python/oop", label: "Object-Oriented Programming" },
        { id: 14, path: "/python/multithreading", label: "Multithreading" },
        { id: 14, path: "/python/multiprocessing", label: "Multiprocessing" },
        { id: 14, path: "/python/asyncio", label: "Asyncio" },
        { id: 14, path: "/python/machine_learning", label: "Machine Learning" },
      ],
    },
    ruby: {
      sub: [
        { id: 15, path: "/ruby/datatypes", label: "Data Types" },
        { id: 15, path: "/ruby/variables", label: "Variables" },
        { id: 15, path: "/ruby/operators", label: "Operators" },
        { id: 15, path: "/ruby/control_structures", label: "Control Structures" },
        { id: 15, path: "/ruby/functions", label: "Functions" },
        { id: 15, path: "/ruby/classes", label: "Classes" },
        { id: 15, path: "/ruby/modules", label: "Modules" },
        { id: 15, path: "/ruby/blocks", label: "Blocks" },
        { id: 15, path: "/ruby/iterators", label: "Iterators" },
        { id: 15, path: "/ruby/arrays", label: "Arrays" },
        { id: 15, path: "/ruby/hashes", label: "Hashes" },
        { id: 15, path: "/ruby/oop", label: "Object-Oriented Programming" },
        { id: 15, path: "/ruby/exceptions", label: "Exception Handling" },
        { id: 15, path: "/ruby/metaprogramming", label: "Metaprogramming" },
        { id: 15, path: "/ruby/file_handling", label: "File Handling" },
      ],
    },
    swift: {
      sub: [
        { id: 16, path: "/swift/datatypes", label: "Data Types" },
        { id: 16, path: "/swift/variables", label: "Variables" },
        { id: 16, path: "/swift/constants", label: "Constants" },
        { id: 16, path: "/swift/control_structures", label: "Control Structures" },
        { id: 16, path: "/swift/functions", label: "Functions" },
        { id: 16, path: "/swift/closures", label: "Closures" },
        { id: 16, path: "/swift/optionals", label: "Optionals" },
        { id: 16, path: "/swift/arrays", label: "Arrays" },
        { id: 16, path: "/swift/dictionaries", label: "Dictionaries" },
        { id: 16, path: "/swift/loops", label: "Loops" },
        { id: 16, path: "/swift/structs", label: "Structs" },
        { id: 16, path: "/swift/classes", label: "Classes" },
        { id: 16, path: "/swift/protocols", label: "Protocols" },
        { id: 16, path: "/swift/error_handling", label: "Error Handling" },
        { id: 16, path: "/swift/extensions", label: "Extensions" },
        { id: 16, path: "/swift/generics", label: "Generics" },
        { id: 16, path: "/swift/multithreading", label: "Multithreading" },
      ],
    },
    typescript: {
      sub: [
        { id: 17, path: "/typescript/datatypes", label: "Data Types" },
        { id: 17, path: "/typescript/variables", label: "Variables" },
        { id: 17, path: "/typescript/functions", label: "Functions" },
        { id: 17, path: "/typescript/interfaces", label: "Interfaces" },
        { id: 17, path: "/typescript/classes", label: "Classes" },
        { id: 17, path: "/typescript/generics", label: "Generics" },
        { id: 17, path: "/typescript/modules", label: "Modules" },
        { id: 17, path: "/typescript/union_types", label: "Union Types" },
        { id: 17, path: "/typescript/tuples", label: "Tuples" },
        { id: 17, path: "/typescript/advanced_types", label: "Advanced Types" },
        { id: 17, path: "/typescript/error_handling", label: "Error Handling" },
        { id: 17, path: "/typescript/enums", label: "Enums" },
        { id: 17, path: "/typescript/decorators", label: "Decorators" },
        { id: 17, path: "/typescript/multithreading", label: "Multithreading" },
        { id: 17, path: "/typescript/asynchronous_programming", label: "Asynchronous Programming" },
      ],
    },
    html: {
      sub: [
        { id: 18, path: "/html/elements", label: "HTML Elements" },
        { id: 18, path: "/html/attributes", label: "HTML Attributes" },
        { id: 18, path: "/html/forms", label: "HTML Forms" },
        { id: 18, path: "/html/tables", label: "HTML Tables" },
        { id: 18, path: "/html/lists", label: "HTML Lists" },
        { id: 18, path: "/html/media", label: "Media (Images, Audio, Video)" },
        { id: 18, path: "/html/semantic_elements", label: "Semantic Elements" },
        { id: 18, path: "/html/forms_and_validation", label: "Forms and Validation" },
        { id: 18, path: "/html/html5", label: "HTML5" },
        { id: 18, path: "/html/meta_tags", label: "Meta Tags" },
      ],
    },
    css: {
      sub: [
        { id: 19, path: "/css/selectors", label: "CSS Selectors" },
        { id: 19, path: "/css/box_model", label: "Box Model" },
        { id: 19, path: "/css/flexbox", label: "Flexbox" },
        { id: 19, path: "/css/grid", label: "Grid Layout" },
        { id: 19, path: "/css/media_queries", label: "Media Queries" },
        { id: 19, path: "/css/pseudo_classes", label: "Pseudo-classes" },
        { id: 19, path: "/css/pseudo_elements", label: "Pseudo-elements" },
        { id: 19, path: "/css/animations", label: "Animations" },
        { id: 19, path: "/css/transitions", label: "Transitions" },
        { id: 19, path: "/css/variables", label: "CSS Variables" },
        { id: 19, path: "/css/responsive_design", label: "Responsive Design" },
        { id: 19, path: "/css/shadows", label: "Box Shadows" },
        { id: 19, path: "/css/gradients", label: "Gradients" },
        { id: 19, path: "/css/z-index", label: "z-index" },
      ],
    },
    javascriptDev: {
      sub: [
        { id: 20, path: "/javascript/datatypes", label: "Data Types" },
        { id: 20, path: "/javascript/variables", label: "Variables" },
        { id: 20, path: "/javascript/conditional_statements", label: "Conditional Statements" },
        { id: 20, path: "/javascript/functions", label: "Functions" },
        { id: 20, path: "/javascript/arrays", label: "Arrays" },
        { id: 20, path: "/javascript/loops", label: "Loops" },
        { id: 20, path: "/javascript/objects", label: "Objects" },
        { id: 20, path: "/javascript/classes", label: "Classes" },
        { id: 20, path: "/javascript/multithreading", label: "Multithreading" },
        { id: 20, path: "/javascript/async_await", label: "Async/Await" },
        { id: 20, path: "/javascript/json", label: "JSON" },
        { id: 20, path: "/javascript/prototype_chain", label: "Prototype Chain" },
        { id: 20, path: "/javascript/closures", label: "Closures" },
        { id: 20, path: "/javascript/hoisting", label: "Hoisting" },
        { id: 20, path: "/javascript/this_keyword", label: "This Keyword" },
        { id: 20, path: "/javascript/dom_manipulation", label: "DOM Manipulation" },
        { id: 20, path: "/javascript/event_handling", label: "Event Handling" },
        { id: 20, path: "/javascript/promise_chaining", label: "Promise Chaining" },
        { id: 20, path: "/javascript/webstorage", label: "Web Storage" },
        { id: 20, path: "/javascript/webworkers", label: "Web Workers" },
        { id: 20, path: "/javascript/service_workers", label: "Service Workers" },
        { id: 20, path: "/javascript/web_components", label: "Web Components" },
      ],
    },
    "tailwind-css": {
      sub: [
        { id: 23, path: "/tailwind/installation", label: "Installation" },
        { id: 23, path: "/tailwind/utility_classes", label: "Utility Classes" },
        { id: 23, path: "/tailwind/responsive_design", label: "Responsive Design" },
        { id: 23, path: "/tailwind/flexbox", label: "Flexbox" },
        { id: 23, path: "/tailwind/grid", label: "Grid" },
        { id: 23, path: "/tailwind/spacing", label: "Spacing" },
        { id: 23, path: "/tailwind/typography", label: "Typography" },
        { id: 23, path: "/tailwind/backgrounds", label: "Backgrounds" },
        { id: 23, path: "/tailwind/colors", label: "Colors" },
        { id: 23, path: "/tailwind/transforms", label: "Transforms" },
        { id: 23, path: "/tailwind/transitions", label: "Transitions" },
        { id: 23, path: "/tailwind/customization", label: "Customization" },
        { id: 23, path: "/tailwind/plugins", label: "Plugins" },
        { id: 23, path: "/tailwind/animations", label: "Animations" },
      ],
    },
    "react-js": {
      sub: [
        { id: 21, path: "/reactjs/components", label: "Components" },
        { id: 21, path: "/reactjs/jsx", label: "JSX" },
        { id: 21, path: "/reactjs/props", label: "Props" },
        { id: 21, path: "/reactjs/state", label: "State" },
        { id: 21, path: "/reactjs/hooks", label: "Hooks" },
        { id: 21, path: "/reactjs/lifecycle", label: "Lifecycle Methods" },
        { id: 21, path: "/reactjs/context_api", label: "Context API" },
        { id: 21, path: "/reactjs/forms", label: "Forms" },
        { id: 21, path: "/reactjs/event_handling", label: "Event Handling" },
        { id: 21, path: "/reactjs/react_router", label: "React Router" },
        { id: 21, path: "/reactjs/refs", label: "Refs" },
        { id: 21, path: "/reactjs/hoc", label: "Higher-Order Components (HOC)" },
        { id: 21, path: "/reactjs/redux", label: "Redux" },
        { id: 21, path: "/reactjs/styling", label: "Styling Components" },
        { id: 21, path: "/reactjs/error_boundaries", label: "Error Boundaries" },
        { id: 21, path: "/reactjs/rendering_performance", label: "Rendering Performance" },
      ],
    },
    "next-js": {
      sub: [
        { id: 22, path: "/nextjs/getting_started", label: "Getting Started" },
        { id: 22, path: "/nextjs/pages", label: "Pages and Routing" },
        { id: 22, path: "/nextjs/static_generation", label: "Static Generation" },
        { id: 22, path: "/nextjs/server_side_rendering", label: "Server-Side Rendering" },
        { id: 22, path: "/nextjs/api_routes", label: "API Routes" },
        { id: 22, path: "/nextjs/styling", label: "Styling Options" },
        { id: 22, path: "/nextjs/data_fetching", label: "Data Fetching" },
        { id: 22, path: "/nextjs/optimizing", label: "Optimizing Performance" },
        { id: 22, path: "/nextjs/environment_variables", label: "Environment Variables" },
        { id: 22, path: "/nextjs/deployment", label: "Deployment" },
        { id: 22, path: "/nextjs/middleware", label: "Middleware" },
        { id: 22, path: "/nextjs/internationalization", label: "Internationalization" },
        { id: 22, path: "/nextjs/image_optimization", label: "Image Optimization" },
        { id: 22, path: "/nextjs/advanced_routing", label: "Advanced Routing" },
        { id: 22, path: "/nextjs/typescript", label: "Using TypeScript with Next.js" },
      ],
    },
    flask: {
      sub: [
        { id: 24, path: "/flask/getting_started", label: "Getting Started" },
        { id: 24, path: "/flask/routing", label: "Routing" },
        { id: 24, path: "/flask/templates", label: "Templates" },
        { id: 24, path: "/flask/static_files", label: "Static Files" },
        { id: 24, path: "/flask/forms", label: "Forms" },
        { id: 24, path: "/flask/database", label: "Database Integration" },
        { id: 24, path: "/flask/sessions", label: "Sessions" },
        { id: 24, path: "/flask/authentication", label: "Authentication" },
        { id: 24, path: "/flask/rest_api", label: "REST API" },
        { id: 24, path: "/flask/deployment", label: "Deployment" },
        { id: 24, path: "/flask/middleware", label: "Middleware" },
        { id: 24, path: "/flask/testing", label: "Testing" },
      ],
    },
    django: {
      sub: [
        { id: 25, path: "/django/getting_started", label: "Getting Started" },
        { id: 25, path: "/django/models", label: "Models" },
        { id: 25, path: "/django/views", label: "Views" },
        { id: 25, path: "/django/templates", label: "Templates" },
        { id: 25, path: "/django/urls", label: "URLs and Routing" },
        { id: 25, path: "/django/forms", label: "Forms" },
        { id: 25, path: "/django/authentication", label: "Authentication" },
        { id: 25, path: "/django/admin", label: "Admin Interface" },
        { id: 25, path: "/django/database", label: "Database Integration" },
        { id: 25, path: "/django/signals", label: "Signals" },
        { id: 25, path: "/django/static_and_media", label: "Static and Media Files" },
        { id: 25, path: "/django/caching", label: "Caching" },
        { id: 25, path: "/django/testing", label: "Testing" },
        { id: 25, path: "/django/deployment", label: "Deployment" },
      ],
    },
    "node-js": {
      sub: [
        { id: 26, path: "/nodejs/getting_started", label: "Getting Started" },
        { id: 26, path: "/nodejs/modules", label: "Modules" },
        { id: 26, path: "/nodejs/file_system", label: "File System" },
        { id: 26, path: "/nodejs/http", label: "HTTP Module" },
        { id: 26, path: "/nodejs/events", label: "Events" },
        { id: 26, path: "/nodejs/streams", label: "Streams" },
        { id: 26, path: "/nodejs/process", label: "Process Module" },
        { id: 26, path: "/nodejs/error_handling", label: "Error Handling" },
        { id: 26, path: "/nodejs/promise", label: "Promise and Async/Await" },
        { id: 26, path: "/nodejs/rest_api", label: "Building REST APIs" },
        { id: 26, path: "/nodejs/authentication", label: "Authentication" },
        { id: 26, path: "/nodejs/websockets", label: "WebSockets" },
        { id: 26, path: "/nodejs/testing", label: "Testing with Node.js" },
        { id: 26, path: "/nodejs/deployment", label: "Deployment" },
      ],
    },
    "express-js": {
      sub: [
        { id: 27, path: "/expressjs/getting_started", label: "Getting Started" },
        { id: 27, path: "/expressjs/routing", label: "Routing" },
        { id: 27, path: "/expressjs/middleware", label: "Middleware" },
        { id: 27, path: "/expressjs/static_files", label: "Serving Static Files" },
        { id: 27, path: "/expressjs/forms", label: "Forms and Body Parsing" },
        { id: 27, path: "/expressjs/sessions", label: "Sessions and Cookies" },
        { id: 27, path: "/expressjs/authentication", label: "Authentication" },
        { id: 27, path: "/expressjs/database", label: "Database Integration" },
        { id: 27, path: "/expressjs/error_handling", label: "Error Handling" },
        { id: 27, path: "/expressjs/rest_api", label: "Building REST APIs" },
        { id: 27, path: "/expressjs/websockets", label: "WebSockets" },
        { id: 27, path: "/expressjs/deployment", label: "Deployment" },
        { id: 27, path: "/expressjs/testing", label: "Testing" },
      ],
    },
    "spring-boot": {
      sub: [
        { id: 28, path: "/springboot/getting_started", label: "Getting Started" },
        { id: 28, path: "/springboot/mvc", label: "Spring MVC" },
        { id: 28, path: "/springboot/data_jpa", label: "Spring Data JPA" },
        { id: 28, path: "/springboot/rest_api", label: "Building REST APIs" },
        { id: 28, path: "/springboot/thymeleaf", label: "Thymeleaf Integration" },
        { id: 28, path: "/springboot/security", label: "Spring Security" },
        { id: 28, path: "/springboot/testing", label: "Testing" },
        { id: 28, path: "/springboot/deployment", label: "Deployment" },
        { id: 28, path: "/springboot/logging", label: "Logging" },
        { id: 28, path: "/springboot/caching", label: "Caching" },
        { id: 28, path: "/springboot/scheduling", label: "Task Scheduling" },
        { id: 28, path: "/springboot/websockets", label: "WebSockets" },
        { id: 28, path: "/springboot/microservices", label: "Microservices" },
        { id: 28, path: "/springboot/actuator", label: "Spring Boot Actuator" },
      ],
    },
    fastapi: {
      sub: [
        { id: 29, path: "/fastapi/getting_started", label: "Getting Started" },
        { id: 29, path: "/fastapi/routing", label: "Routing" },
        { id: 29, path: "/fastapi/path_parameters", label: "Path and Query Parameters" },
        { id: 29, path: "/fastapi/validation", label: "Data Validation" },
        { id: 29, path: "/fastapi/dependencies", label: "Dependencies" },
        { id: 29, path: "/fastapi/authentication", label: "Authentication" },
        { id: 29, path: "/fastapi/database", label: "Database Integration" },
        { id: 29, path: "/fastapi/cookies", label: "Cookies and Sessions" },
        { id: 29, path: "/fastapi/rest_api", label: "Building REST APIs" },
        { id: 29, path: "/fastapi/testing", label: "Testing" },
        { id: 29, path: "/fastapi/deployment", label: "Deployment" },
        { id: 29, path: "/fastapi/websockets", label: "WebSockets" },
        { id: 29, path: "/fastapi/background_tasks", label: "Background Tasks" },
      ],
    },
    aptitude: {
        sub : [
          { id: 5, path: "/problems-on-trains", label: "Problems on Trains" , subject:"Aptitude"},
          { id: 5, path: "/time-and-distance", label: "Time and Distance", subject:"Aptitude" },
          { id: 5, path: "/height-and-distance", label: "Height and Distance", subject:"Aptitude" },
          { id: 5, path: "/time-and-work", label: "Time and Work", subject:"Aptitude" },
          { id: 5, path: "/simple-interest", label: "Simple Interest", subject:"Aptitude" },
          { id: 5, path: "/compound-interest", label: "Compound Interest", subject:"Aptitude" },
          { id: 5, path: "/profit-and-loss", label: "Profit and Loss", subject:"Aptitude" },
          { id: 5, path: "/partnership", label: "Partnership", subject:"Aptitude" },
          { id: 5, path: "/percentage", label: "Percentage", subject:"Aptitude" },
          { id: 5, path: "/problems-on-ages", label: "Problems on Ages", subject:"Aptitude" },
          { id: 5, path: "/calendar", label: "Calendar", subject:"Aptitude" },
          { id: 5, path: "/clock", label: "Clock", subject:"Aptitude" },
          { id: 5, path: "/average", label: "Average", subject:"Aptitude" },
          { id: 5, path: "/area", label: "Area", subject:"Aptitude" },
          { id: 5, path: "/volume-and-surface-area", label: "Volume and Surface Area", subject:"Aptitude" },
          { id: 5, path: "/permutation-and-combination", label: "Permutation and Combination", subject:"Aptitude" },
          { id: 5, path: "/numbers", label: "Numbers", subject:"Aptitude" },
          { id: 5, path: "/problems-on-numbers", label: "Problems on Numbers", subject:"Aptitude" },
          { id: 5, path: "/hcf-and-lcm", label: "Problems on H.C.F and L.C.M", subject:"Aptitude" },
          { id: 5, path: "/decimal-fraction", label: "Decimal Fraction", subject:"Aptitude" },
          { id: 5, path: "/simplification", label: "Simplification", subject:"Aptitude" },
          { id: 5, path: "/square-root-and-cube-root", label: "Square Root and Cube Root", subject:"Aptitude" },
          { id: 5, path: "/surds-and-indices", label: "Surds and Indices", subject:"Aptitude" },
          { id: 5, path: "/ratio-and-proportion", label: "Ratio and Proportion", subject:"Aptitude" },
          { id: 5, path: "/chain-rule", label: "Chain Rule", subject:"Aptitude" },
          { id: 5, path: "/pipes-and-cistern", label: "Pipes and Cistern", subject:"Aptitude" },
          { id: 5, path: "/boats-and-streams", label: "Boats and Streams", subject:"Aptitude" },
          { id: 5, path: "/alligation-or-mixture", label: "Alligation or Mixture", subject:"Aptitude" },
          { id: 5, path: "/logarithm", label: "Logarithm", subject:"Aptitude" },
          { id: 5, path: "/races-and-games", label: "Races and Games", subject:"Aptitude" },
          { id: 5, path: "/stocks-and-shares", label: "Stocks and Shares", subject:"Aptitude" },
          { id: 5, path: "/probability", label: "Probability", subject:"Aptitude" },
          { id: 5, path: "/true-discount", label: "True Discount", subject:"Aptitude" },
          { id: 5, path: "/bankers-discount", label: "Banker's Discount", subject:"Aptitude" }
        ]
    },
    "machine Learning": {
        sub : [
          { id: 4, path: "/introduction", label: "Introduction to Machine Learning", subject:"Machine Learning" },
          { id: 4, path: "/data-preprocessing", label: "Data Preprocessing", subject:"Machine Learning" },
          { id: 4, path: "/supervised-learning", label: "Supervised Learning", subject:"Machine Learning" },
          { id: 4, path: "/linear-regression", label: "Linear Regression", subject:"Machine Learning" },
          { id: 4, path: "/logistic-regression", label: "Logistic Regression", subject:"Machine Learning" },
          { id: 4, path: "/decision-trees", label: "Decision Trees", subject:"Machine Learning" },
          { id: 4, path: "/random-forest", label: "Random Forest", subject:"Machine Learning" },
          { id: 4, path: "/svm", label: "Support Vector Machines (SVM)", subject:"Machine Learning" },
          { id: 4, path: "/naive-bayes", label: "Naive Bayes", subject:"Machine Learning" },
          { id: 4, path: "/k-nearest-neighbors", label: "K-Nearest Neighbors (KNN)", subject:"Machine Learning" },
          { id: 4, path: "/unsupervised-learning", label: "Unsupervised Learning", subject:"Machine Learning" },
          { id: 4, path: "/clustering", label: "Clustering (e.g., K-Means)", subject:"Machine Learning" },
          { id: 4, path: "/dimensionality-reduction", label: "Dimensionality Reduction (e.g., PCA)", subject:"Machine Learning" },
          { id: 4, path: "/model-evaluation", label: "Model Evaluation and Validation", subject:"Machine Learning" },
          { id: 4, path: "/hyperparameter-tuning", label: "Hyperparameter Tuning", subject:"Machine Learning" },
          { id: 4, path: "/deployment", label: "Model Deployment", subject:"Machine Learning" },
        ]
    }
  };

  const handleChange = async (e) => {
    setShortNotes(e.target.value);
  };

  return (
    <div className="lg:grid lg:grid-cols-3 gap-10 p-10 flex flex-col">
      <div className="text-center bg-[#ebe7de5b] p-2 rounded-md shadow-lg border">
        <h1 className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2">
          Topics
        </h1>
        <div className="flex flex-col md:space-y-12 space-y-8 my-5 max-h-[60vh] overflow-y-scroll">
          {topics[subject].sub?.map((topic, index) => (
            <p key={index} className="text-xl flex justify-center cursor-pointer" onClick={() => renderContent(topic.label, subject, topic.id)}>{topic.label} {checkTask(topic.label, subject) && <HiBadgeCheck className="ml-2 mt-1"/>}</p>
          ))}
        </div>
      </div>

      <div className="text-center bg-[#ebe7de5b] p-2 rounded-md shadow-lg border col-span-2">
        <h1 className="bg-[#e4e2e2] text-2xl text-center rounded-md my-2" >
          Short Notes
        </h1>
        <textarea 
        className={`w-[95%] h-[100%] min-h-[30vh] max-h-[55vh] bg-[#ebe7de34] rounded-md ${disabled ? "cursor-not-allowed" : ""}`} 
        disabled={disabled}
        value={shortNotes}
        onChange={(e) => handleChange(e)}
        />
        <div>
          {disabled ? (
            <>
            <button className={`w-[20%] h-[10%] bg-black text-white rounded-md my-2 font-semibold text-sm py-2`} onClick={() => setDisabled(false)}>Edit</button>
            </>
          ) : (
            <>
            <button className={`w-[20%] h-[10%] bg-black text-white rounded-md my-2 font-semibold text-sm py-2`} onClick={() => setDisabled(true)}>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
    // <></>
  );
}

export default Topic;
