export default function AIError({ message, onBack, backText = "Go Back" }) {
  return (
    <div className="text-center mt-20 px-6">
      <p className="text-red-600 font-medium mb-4">
        {message}
      </p>

      {onBack && (
        <button
          onClick={onBack}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {backText}
        </button>
      )}
    </div>
  );
}
