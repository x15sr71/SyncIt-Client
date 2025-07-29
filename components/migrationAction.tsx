import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

// Define interface for props
interface MigrationActionProps {
  handleStartMigration: () => void;
  selectedPlaylists: {
    [key: string]: boolean;
  };
}

export default function MigrationAction({
  handleStartMigration,
  selectedPlaylists,
}: MigrationActionProps) {
  return (
    <>
      <Button
        size="lg"
        onClick={handleStartMigration}
        disabled={
          Object.keys(selectedPlaylists).filter(
            (id) => selectedPlaylists[id]
          ).length === 0
        }
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-8 py-4 focus-visible:outline-2 focus-visible:outline-purple-400 focus-visible:outline-offset-2 transition-all hover:scale-105 shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <ArrowRight className="w-5 h-5 mr-2" />
        Start Migration (
        {
          Object.keys(selectedPlaylists).filter(
            (id) => selectedPlaylists[id]
          ).length
        }{" "}
        selected)
      </Button>
    </>
  );
}
