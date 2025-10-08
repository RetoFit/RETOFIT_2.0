import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Challenge } from '@/lib/data';
import { Users, Footprints, Dumbbell, Timer } from 'lucide-react';
import { Badge } from './ui/badge';

type ChallengeCardProps = {
  challenge: Challenge;
};

const getIcon = (type: 'steps' | 'distance' | 'time') => {
  switch (type) {
    case 'steps':
      return <Footprints className="h-4 w-4" />;
    case 'distance':
      return <Timer className="h-4 w-4" />;
    case 'time':
      return <Dumbbell className="h-4 w-4" />;
  }
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={challenge.image.imageUrl}
            alt={challenge.image.description}
            fill
            className="object-cover"
            data-ai-hint={challenge.image.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="mb-2 font-headline">{challenge.name}</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
            {getIcon(challenge.type)}
            <span className="capitalize">{challenge.type}</span>
          </Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{challenge.participants.length} Participants</span>
        </div>
        <Link href={`/dashboard/challenges/${challenge.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
