"use client";

import { useState } from "react";

import { client } from "@/lib/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const RecentPost = () => {
  const [name, setName] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: recentPost, isPending: isLoadingPosts } = useQuery({
    queryKey: ["get-recent-post"],
    queryFn: async () => {
      const res = await client.post.recent.$get();
      return await res.json();
    },
    retry: 1,
  });

  const {
    data: allPost,
    isPending: isLoadingAllPosts,
    isError: isErrorAllPosts,
    error: errorAllPosts,
  } = useQuery({
    queryKey: ["get-all-post"],
    queryFn: async () => {
      const res = await client.post.all.$get();
      return await res.json();
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await client.post.create.$post({ name });
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["get-recent-post"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-all-post"],
      });
      setName("");
    },
    onError: (error) => {
      console.log("createPost Error: ", error);
      toast.error(error.message);
    },
  });

  return (
    <div className="max-w-sm backdrop-blur-lg w-full bg-black/15 px-8 py-6 rounded-md text-zinc-100/75 space-y-2">
      {isLoadingPosts ? (
        <p className="text-[#ececf399] text-base/6">Loading posts...</p>
      ) : recentPost ? (
        <p className="text-[#ececf399] text-base/6">
          {`Your recent post: "${recentPost.name}"`}
        </p>
      ) : (
        <p className="text-[#ececf399] text-base/6">You have no posts yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost({ name });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            createPost({ name });
          }
        }}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Enter a title..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-base/6 rounded-md bg-black/50 hover:bg-black/75 focus-visible:outline-none ring-2 ring-transparent  hover:ring-zinc-800 focus:ring-zinc-800 focus:bg-black/75 transition h-12 px-4 py-2 text-zinc-100"
        />
        <button
          disabled={isPending}
          type="submit"
          className="rounded-md text-base/6 ring-2 ring-offset-2 ring-offset-black focus-visible:outline-none focus-visible:ring-zinc-100 ring-transparent hover:ring-zinc-100 h-12 px-10 py-3 bg-brand-700 text-zinc-800 font-medium bg-gradient-to-tl from-zinc-300 to-zinc-200 transition hover:bg-brand-800"
        >
          {isPending ? "Creating..." : "Create Post"}
        </button>
      </form>

      <div className="mt-4">
        {isLoadingAllPosts ? (
          <p className="text-[#ececf399] text-base/6">Loading posts...</p>
        ) : allPost?.length ? (
          <ul className="text-[#ececf399] text-base/6 list-disc pl-4">
            {allPost.map((post) => (
              <li key={post.id}>{post.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[#ececf399] text-base/6">
            {isErrorAllPosts ? errorAllPosts.message : "You have no posts yet."}
          </p>
        )}
      </div>
    </div>
  );
};
