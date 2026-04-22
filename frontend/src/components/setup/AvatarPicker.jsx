import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { usePlayer } from "@context/PlayerContext";

export default function AvatarPicker() {
  const { avatar, setAvatar } = usePlayer();
  const [pickerOpen, setPickerOpen] = useState(false);

  const onEmojiClick = (emojiData) => {
    setAvatar(emojiData.emoji);
    setPickerOpen(false);
  };

  return (
    <div className="relative w-35 h-35 flex items-center justify-center rounded-full bg-yale-blue/10">
      <span style={{ fontSize: "6rem", lineHeight: 1 }}>{avatar}</span>

      <button
        type="button"
        onClick={() => setPickerOpen((v) => !v)}
        className="absolute right-0 top-0 -translate-x-1 translate-y-1 w-8 h-8 rounded-full bg-yale-blue flex items-center justify-center hover:bg-spicy-orange transition-colors"
      >
        <FaPencilAlt className="text-ivory w-3 h-3" />
      </button>

      {pickerOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}