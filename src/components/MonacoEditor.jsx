import Editor from "@monaco-editor/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import * as Babel from "@babel/standalone";

const MonacoEditor = (props) => {
  const [value, setValue] = useState();
  const [output, setOutput] = useState();
  const [darkMode, setDarkMode] = useState(false)
  const handleEditorChange = (value) => {
    setValue(value);
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    fontSize: 13,
    automaticLayout: true,
  };
  let theme = "light"
  if (darkMode === true) {
    theme = "vs-dark"
  }

  const handleToggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  const handleRunCode = () => {
    try {
      const transformedCode = Babel.transform(value, { presets: ["env"] }).code;
      const output = eval(transformedCode);
      setOutput(output);
    } catch (error) {
      console.error(error);
    }
  };

  const { id } = useParams();
  const questions = props.questions;
  const currentQuestion = questions[id - 1];

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      {/* nav component */}
      <nav className="pb-4 mb-4 w-full border-b-2 flex flex-row justify-between">
        <Link to="/" className="">
          Home
        </Link>
        <button onClick={handleToggleTheme}>Toggle editor theme</button>
      </nav>
      {/* end of nav component */}

      <div className="flex flex-row">
        <div className="w-1/2 bg-slate-100 p-6">
          <h1 className=" text-xl font-bold ">{currentQuestion.title}</h1>
          <p className="text-left	 px-2 my-4">{currentQuestion.description}</p>
          <h2 className="text-left font-bold px-2 pb-2">Example</h2>
          <p className="text-left display-linebreak px-2">
            {currentQuestion.example}
          </p>
        </div>
        <Editor
          height="66vh"
          width={`100%`}
          defaultLanguage="javascript"
          defaultValue={`${currentQuestion.code}`}
          value={value}
          onChange={handleEditorChange}
          theme={theme}
          options={editorOptions}
        />
      </div>

      <div className="bg-slate-200 h-20 flex flex-col items-center justify-evenly w-full">
        Output: {output}
      </div>
      <button
        onClick={handleRunCode}
        className="bg-gray-500 text-white py-4 px-12 mr-4 rounded-lg mt-4 hover:bg-gray-600"
      >
        Run code
      </button>
    </div>
  );
};
export default MonacoEditor;
