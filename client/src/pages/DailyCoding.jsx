import { useDispatch } from "react-redux";
import { updateStats } from "../redux/slices/authSlice";
import { updateDailyCoding } from "../services/userApi";

export default function DailyCoding() {
  const dispatch = useDispatch();

  const handleCompleteCoding = async () => {
    try {
      const res = await updateDailyCoding();

      dispatch(
        updateStats({
          dailyCodingStreak: res.data.dailyCodingStreak,
        })
      );

      alert("Daily coding recorded 🔥");
    } catch (error) {
      alert("Error updating daily coding");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Daily Coding</h2>

      <button
        onClick={handleCompleteCoding}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Mark Coding as Done Today
      </button>
    </div>
  );
}
