import type { TeamMember } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card
      key={member.id}
      className="group h-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
    >
      <CardHeader className="flex items-center justify-center py-4">
        <div className="rounded-full bg-blue-500 p-0.5">
          <div className="h-20 w-20 overflow-hidden rounded-full">
            <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <CardTitle className="text-lg">{member.name}</CardTitle>
        <div className="my-2 text-sm">{member.id}</div>
        <div className="space-y-1 text-left text-sm">
          <p>
            <span className="font-medium">Faculty:</span> Computer Science
          </p>
          <p>
            <span className="font-medium">University:</span> HCMUIT
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
