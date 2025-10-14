'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Challenge, ProgressLog } from '@/lib/data';
import { users } from '@/lib/data';
import { recognizeMilestone } from '@/ai/flows/dynamic-milestone-recognition';
import { Loader2 } from 'lucide-react';

type ChallengeProgressProps = {
  challenge: Challenge;
  initialProgress: ProgressLog;
};

const currentUser = users[0]; // Mock current user

export function ChallengeProgress({
  challenge,
  initialProgress,
}: ChallengeProgressProps) {
  const [currentProgress, setCurrentProgress] = useState(
    initialProgress.progress
  );
  const { toast } = useToast();

  const progressPercentage = (currentProgress / challenge.target) * 100;

  async function handleLogProgress(
    _prevState: any,
    formData: FormData
  ): Promise<{ message: string | null; error: string | null }> {
    const amount = Number(formData.get('amount'));

    if (isNaN(amount) || amount <= 0) {
      return { message: null, error: 'Please enter a valid positive number.' };
    }

    const newProgress = currentProgress + amount;
    setCurrentProgress(newProgress);
    
    try {
        const milestoneResult = await recognizeMilestone({
          userId: currentUser.id,
          challengeName: challenge.name,
          progress: newProgress,
          target: challenge.target,
        });
  
        if (milestoneResult.achievedMilestone) {
          toast({
            title: '🎉 Milestone Reached! 🎉',
            description: milestoneResult.reward,
            duration: 5000,
          });
        }
        return { message: `Successfully logged ${amount} ${challenge.unit}!`, error: null };
    } catch(e) {
        console.error(e);
        return { message: null, error: 'Could not check for milestones.' };
    }
  }

  const [state, formAction] = useFormState(handleLogProgress, { message: null, error: null });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>
          You are at {Math.floor(progressPercentage)}% of your goal. Keep going!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercentage} className="h-4" />
        <div className="text-center font-mono text-2xl font-bold tracking-tighter">
          {currentProgress.toLocaleString()} /{' '}
          {challenge.target.toLocaleString()} {challenge.unit}
        </div>
      </CardContent>
      <CardFooter>
        <form action={formAction} className="w-full space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amount">Log New Progress</Label>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="number"
                id="amount"
                name="amount"
                placeholder={`e.g., 5000 for ${challenge.unit}`}
                required
              />
              <SubmitButton />
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            {state?.message && <p className="text-sm text-green-600">{state.message}</p>}
          </div>
        </form>
      </CardFooter>
    </Card>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log
        </Button>
    )
}
