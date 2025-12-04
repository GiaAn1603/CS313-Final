import { WeatherSkeleton } from "@/components/loading-skeleton";
import { MemberCard } from "@/components/member-card";
import { useTeamMembers } from "@/hooks/use-team-members";

export function AboutUs() {
  const { members, isLoading } = useTeamMembers();
  if (isLoading) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Meet Our Team</h1>
        <p className="mx-auto max-w-2xl text-lg">
          We are Computer Science students from the University of Information Technology, committed
          to building innovative and impactful solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
