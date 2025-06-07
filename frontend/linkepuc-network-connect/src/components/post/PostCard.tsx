
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookmarkIcon, Heart, MessageSquare, Share2 } from "lucide-react";

interface PostProps {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function PostCard({
  id,
  author,
  timeAgo,
  content,
  image,
  likes,
  comments,
  isLiked = false,
  isSaved = false,
}: PostProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [saved, setSaved] = useState(isSaved);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${author.id}`}>
            <Avatar>
              <AvatarImage src={author.avatar} />
              <AvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${author.id}`}
                className="font-medium hover:underline"
              >
                {author.name}
              </Link>
            </div>
            <div className="text-xs text-muted-foreground flex gap-2">
              <span>{author.role}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="text-sm">
          <p className="whitespace-pre-line">{content}</p>
        </div>
        {image && (
          <div className="mt-3">
            <img
              src={image}
              alt="Post"
              className="rounded-md w-full object-cover max-h-80"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-2 ${liked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart size={18} className={liked ? "fill-red-500" : ""} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2"
            onClick={() => {}}
          >
            <MessageSquare size={18} />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <Share2 size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={saved ? "text-primary" : ""}
            onClick={handleSave}
          >
            <BookmarkIcon
              size={18}
              className={saved ? "fill-primary" : ""}
            />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
