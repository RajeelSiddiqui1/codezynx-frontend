import React, { useState } from "react";
import { useAddReply, useToggleCommentLike } from "../hooks/usePostActions";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

const CommentItem = ({ postId, comment, authUserId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const addReplyMutation = useAddReply(postId, comment._id);
  const likeMutation = useToggleCommentLike(postId, comment._id);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addReplyMutation.mutate(replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  const likedByUser = comment.likes?.includes(authUserId);

  return (
    <div className="ml-4 mt-3">
      {/* Main Comment */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded px-4 py-2">
        <p className="font-medium">{comment.user?.username}</p>
        <p>{comment.text}</p>

        {/* Like/Reply Buttons */}
        <div className="flex items-center gap-4 mt-2 text-sm">
          <button
            onClick={() => likeMutation.mutate()}
            className="flex items-center gap-1"
          >
            {likedByUser ? <FaThumbsUp className="text-blue-500" /> : <FaRegThumbsUp />}
            <span>{comment.likes?.length || 0}</span>
          </button>
          <button onClick={() => setShowReplyInput(!showReplyInput)}>
            Reply
          </button>
        </div>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <form onSubmit={handleReply} className="flex gap-2 mt-2 ml-4">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button className="px-3 py-1 bg-blue-400 text-white rounded">Send</button>
        </form>
      )}

      {/* Nested Replies */}
      {comment.replies?.map((reply) => (
        <div
          key={reply._id}
          className="ml-8 mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded"
        >
          <p className="font-medium">{reply.user?.username}</p>
          <p>{reply.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentItem;
