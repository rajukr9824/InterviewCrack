const InterviewExperienceCard = ({ exp }) => {
  return (
    <div className="border rounded p-4 shadow-sm">
      <h3 className="text-lg font-semibold">
        {exp.companyName} – {exp.role}
      </h3>

      <p className="text-sm text-gray-500">
        Difficulty: {exp.difficulty}
      </p>

      <p className="mt-2">
        <strong>Rounds:</strong> {exp.rounds}
      </p>

      <p className="mt-2 text-gray-700">
        {exp.description}
      </p>
    </div>
  );
};

export default InterviewExperienceCard;
