import { notFound } from 'next/navigation';
import Image from 'next/image';
import {
  challenges,
  progressLogs,
  users,
  type Challenge,
} from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Footprints, Dumbbell, Timer, Users, Target } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Leaderboard } from '@/components/leaderboard';
import { ChallengeProgress } from '@/components/challenge-progress';

type ChallengePageProps = {
  params: {
    id: string;
  };
};

const getChallengeData = (id: string): Challenge | undefined => {
  return challenges.find((c) => c.id === id);
};

const getIcon = (type: 'steps' | 'distance' | 'time') => {
  const className = 'h-5 w-5 text-primary';
  switch (type) {
    case 'steps':
      return <Footprints className={className} />;
    case 'distance':
      return <Timer className={className} />;
    case 'time':
      return <Dumbbell className={className} />;
  }
};

// Mock current user
const currentUser = users[0];

export default function ChallengePage({ params }: ChallengePageProps) {
  const challenge = getChallengeData(params.id);

  if (!challenge) {
    notFound();
  }

  const userProgress = progressLogs.find(
    (p) => p.challengeId === challenge.id && p.userId === currentUser.id
  );

  if (!userProgress) {
    // In a real app, you might create a progress entry here or handle it differently
    // For this mock, we'll assume a user joining a challenge has a progress log.
    // Let's create one on the fly if not found.
    progressLogs.push({
      challengeId: challenge.id,
      userId: currentUser.id,
      progress: 0,
      date: new Date(),
    });
    return ChallengePage({ params });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header section */}
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <Image
          src={challenge.image.imageUrl}
          alt={challenge.image.description}
          fill
          className="object-cover"
          data-ai-hint={challenge.image.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-white">
            {challenge.name}
          </h1>
          <p className="mt-2 max-w-xl text-lg text-primary-foreground/80">
            {challenge.description}
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Progress and Details */}
        <div className="lg:col-span-2 space-y-8">
          <ChallengeProgress
            challenge={challenge}
            initialProgress={userProgress}
          />
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                {getIcon(challenge.type)}
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {challenge.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Goal</p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.target.toLocaleString()} {challenge.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4 sm:col-span-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.participants.length} people have joined this
                    challenge.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>See where you stand among the competition.</CardDescription>
            </CardHeader>
            <CardContent>
              <Leaderboard challenge={challenge} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
