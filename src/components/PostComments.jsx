// import React, { useState } from "react";
// import {
//   useAddComment,
//   useAddReply,
//   useToggleCommentLike,
// } from "../hooks/usePostActions";

// const PostComments = ({ postId, comments, setComments }) => {
//   const [text, setText] = useState("");
//   const [replyText, setReplyText] = useState({});
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [replyLoading, setReplyLoading] = useState({});
//   const [likeLoading, setLikeLoading] = useState({});

//   const addCommentMutation = useAddComment(postId);
//   const addReplyMutation = useAddReply(postId);
//   const toggleLike = (commentId) => useToggleCommentLike(postId, commentId);

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;
//     setLoading(true);
//     try {
//       const newComment = await addCommentMutation.mutateAsync(text);
//       setComments((prev) => [...prev, newComment.comment]);
//       setText("");
//     } catch (err) {
//       console.error("Error posting comment:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReplySubmit = async (e, commentId) => {
//     e.preventDefault();
//     if (!replyText[commentId]?.trim()) return;
//     setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
//     try {
//       const reply = await addReplyMutation.mutateAsync({ commentId, text: replyText[commentId] });
//       setComments((prev) =>
//         prev.map((c) =>
//           c._id === commentId
//             ? { ...c, replies: [...(c.replies || []), reply.reply] }
//             : c
//         )
//       );
//       setReplyText({ ...replyText, [commentId]: "" });
//       setReplyingTo(null);
//     } catch (err) {
//       console.error("Error posting reply:", err);
//     } finally {
//       setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
//     }
//   };

//   const handleLike = async (commentId) => {
//     setLikeLoading((prev) => ({ ...prev, [commentId]: true }));
//     try {
//       await toggleLike(commentId).mutateAsync();
//     } catch (err) {
//       console.error("Like/unlike failed:", err);
//     } finally {
//       setLikeLoading((prev) => ({ ...prev, [commentId]: false }));
//     }
//   };

//   return (
//     <div className="mt-6">
//       <h3 className="text-xl font-semibold text-white mb-2">Comments</h3>

//       <form onSubmit={handleCommentSubmit} className="mb-4">
//         <textarea
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Write a comment..."
//           className="w-full p-3 rounded-md border bg-gray-900 text-white"
//           rows={2}
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
//         >
//           {loading ? "Posting..." : "Add Comment"}
//         </button>
//       </form>

//       <div className="space-y-4">
//         {comments?.length > 0 ? (
//           comments.map((c) => (
//             <div key={c._id} className="p-3 rounded-md bg-gray-800 text-white shadow">
//               <div className="font-semibold">{c.commentedBy?.fullName || "User"}</div>
//               <div className="text-sm mt-1">{c.text}</div>
//               <div className="text-xs text-gray-400 mt-1">
//                 {new Date(c.createdAt).toLocaleString()}
//               </div>

//               <div className="mt-2 flex gap-4 text-sm text-blue-400">
//                 <button
//                   onClick={() => handleLike(c._id)}
//                   disabled={likeLoading[c._id]}
//                 >
//                   👍 {c.likes?.length || 0} {likeLoading[c._id] ? "(Loading...)" : ""}
//                 </button>
//                 <button onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}>
//                   💬 Reply
//                 </button>
//               </div>

//               {replyingTo === c._id && (
//                 <form onSubmit={(e) => handleReplySubmit(e, c._id)} className="mt-2 ml-4">
//                   <textarea
//                     value={replyText[c._id] || ""}
//                     onChange={(e) =>
//                       setReplyText({ ...replyText, [c._id]: e.target.value })
//                     }
//                     placeholder="Write a reply..."
//                     className="w-full p-2 rounded-md border bg-gray-700 text-white"
//                     rows={2}
//                   />
//                   <button
//                     type="submit"
//                     disabled={replyLoading[c._id]}
//                     className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
//                   >
//                     {replyLoading[c._id] ? "Sending..." : "Send"}
//                   </button>
//                 </form>
//               )}

//               {c.replies?.length > 0 && (
//                 <div className="ml-4 mt-3 space-y-2 border-l border-gray-700 pl-3">
//                   {c.replies.map((r) => (
//                     <div
//                       key={r._id}
//                       className="text-sm bg-gray-700 p-2 rounded-md text-white"
//                     >
//                       <div className="font-semibold">
//                         {r.commentedBy?.fullName || "User"}
//                       </div>
//                       <div>{r.text}</div>
//                       <div class aname="text-xs text-gray-400">
//                         {new Date(r.createdAt).toLocaleString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">No comments yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };
// export default PostComments;






import React, { useState } from "react";
import {
  useAddComment,
  useAddReply,
  useToggleCommentLike,
} from "../hooks/usePostActions";

const PostComments = ({ postId, comments, setComments, socket }) => {
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyLoading, setReplyLoading] = useState({});
  const [seeMore, setSeeMore] = useState({});

  const addCommentMutation = useAddComment(postId);
  const addReplyMutation = useAddReply(postId);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newComment = await addCommentMutation.mutateAsync(text);
    socket.emit("new_comment", { postId, comment: newComment.comment });
    setText("");
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const reply = await addReplyMutation.mutateAsync({
      commentId,
      text: replyText[commentId],
    });
    socket.emit("new_reply", {
      postId,
      commentId,
      reply: reply.reply,
    });
    setReplyText({ ...replyText, [commentId]: "" });
    setReplyingTo(null);
  };

  const handleLike = async (commentId) => {
    const likeMutation = useToggleCommentLike(postId, commentId);
    const res = await likeMutation.mutateAsync();
    socket.emit("like_updated", {
      postId,
      commentId,
      likes: res.totalLikes,
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-white mb-2">Comments</h3>

      {/* Comment input */}
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 rounded-md border bg-gray-900 text-white"
          rows={2}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Add Comment
        </button>
      </form>

      {/* List comments */}
      <div className="space-y-4">
        {comments?.length > 0 ? (
          comments.map((c) => {
            const replies = seeMore[c._id]
              ? c.replies
              : c.replies?.slice(0, 1);

            return (
              <div
                key={c._id}
                className="p-3 rounded-md bg-gray-800 text-white shadow"
              >
                <div className="font-semibold">{c.commentedBy?.fullName || "User"}</div>
                <div className="text-sm mt-1">{c.text}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </div>

                {/* Like / Reply buttons */}
                <div className="mt-2 flex gap-4 text-sm text-blue-400">
                  <button onClick={() => handleLike(c._id)}>
                    👍 {c.likes?.length || 0}
                  </button>
                  <button
                    onClick={() =>
                      setReplyingTo(replyingTo === c._id ? null : c._id)
                    }
                  >
                    💬 Reply
                  </button>
                </div>

                {/* Reply form */}
                {replyingTo === c._id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, c._id)}
                    className="mt-2 ml-4"
                  >
                    <textarea
                      value={replyText[c._id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [c._id]: e.target.value })
                      }
                      placeholder="Write a reply..."
                      className="w-full p-2 rounded-md border bg-gray-700 text-white"
                      rows={2}
                    />
                    <button
                      type="submit"
                      className="mt-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Send
                    </button>
                  </form>
                )}

                {/* Replies */}
                {c.replies?.length > 0 && (
                  <div className="ml-4 mt-3 space-y-2 border-l border-gray-700 pl-3">
                    {replies.map((r) => (
                      <div key={r._id} className="text-sm bg-gray-700 p-2 rounded-md text-white">
                        <div className="font-semibold">
                          {r.commentedBy?.fullName || "User"}
                        </div>
                        <div>{r.text}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}

                    {c.replies.length > 1 && (
                      <button
                        onClick={() =>
                          setSeeMore((prev) => ({
                            ...prev,
                            [c._id]: !prev[c._id],
                          }))
                        }
                        className="text-xs text-blue-400 hover:underline"
                      >
                        {seeMore[c._id] ? "Hide replies" : "See more replies"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostComments;
