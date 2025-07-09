import Post from "./Post";

export default function Feed({ data = [] }) {
  return (
    <div>
      {data.length === 0 ? (
        <p className="text-center text-gray-400 mt-4">No posts found</p>
      ) : (
        data.map((post) => <Post key={post._id} post={post} />)
      )}
    </div>
  );
}
