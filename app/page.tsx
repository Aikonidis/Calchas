import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(['']);
  const [predictions, setPredictions] = useState(null);

  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, '']);
  };

  const submit = () => {
    // Simulate prediction logic with random percentages
    const results = answers.map(() => Math.floor(Math.random() * 100));
    const total = results.reduce((a, b) => a + b, 0);
    const normalized = results.map((val) => Math.round((val / total) * 100));
    setPredictions(normalized);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calchas Prediction Agent</h1>

      <label className="block mb-2">Upload Product Image:</label>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
      {image && <img src={image} alt="Preview" className="w-64 h-auto mb-4 rounded shadow" />}

      <label className="block mb-2">Enter Poll Question:</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Would gamers wear this?"
        className="w-full p-2 border mb-4 rounded"
      />

      <label className="block mb-2">Answer Options:</label>
      {answers.map((ans, i) => (
        <input
          key={i}
          type="text"
          value={ans}
          onChange={(e) => handleAnswerChange(i, e.target.value)}
          placeholder={`Option ${i + 1}`}
          className="w-full p-2 border mb-2 rounded"
        />
      ))}
      <button onClick={addAnswer} className="px-4 py-2 bg-gray-200 rounded mb-4">+ Add Option</button>

      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700"
      >
        Predict Responses
      </button>

      {predictions && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Predicted Poll Results:</h2>
          <ul className="space-y-2">
            {answers.map((ans, i) => (
              <li key={i} className="bg-gray-100 p-2 rounded shadow">
                <strong>{ans}:</strong> {predictions[i]}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
