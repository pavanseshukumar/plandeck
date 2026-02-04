"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [timer, setTimer] = React.useState(120); // 2 minutes in seconds

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(120); // Reset to 2 minutes
    // Add your resend logic here
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the 6-digit code we sent to your email address
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              className="w-full mt-2 cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 w-full">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="w-full flex items-center justify-center mt-2">
                  <InputOTP maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            onClick={() => router.push("/confirm-password")}
            className="w-full cursor-pointer"
          >
            Verify code
          </Button>
          <Button
            variant="link"
            className="text-sm"
            onClick={handleResend}
            disabled={timer > 0}
          >
            {timer > 0 ? `Resend code in ${formatTime(timer)}` : "Resend code"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
