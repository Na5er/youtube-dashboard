export interface VideoDTO {
  id: string;
  title: string;
  earnings: number;
  channelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDTO {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  channelId?: string | null;
  targetUserId?: string | null;
  author: {
    id: string;
    name: string;
    username: string;
  };
}

export interface ChannelDTO {
  id: string;
  name: string;
  link: string;
  liveStreamsCount: number;
  regularVideosCount: number;
  publishedAt: string;
  totalEarnings: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  videos: VideoDTO[];
  notes?: NoteDTO[];
}

export interface UserSummaryDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  channelsCount: number;
  totalEarnings: number;
  totalVideos: number;
  totalLiveStreams: number;
}

export interface UserDetailDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  channels: ChannelDTO[];
  notes: NoteDTO[];
}
