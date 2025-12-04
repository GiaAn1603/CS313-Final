import { useEffect, useState } from "react";
import { TEAM_MEMBERS } from "@/data/team-members";

export function useTeamMembers() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAvatars = async () => {
      try {
        const promises = TEAM_MEMBERS.map((member) => {
          return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.src = member.avatar;
            img.onload = () => resolve();
            img.onerror = () => reject();
          });
        });

        await Promise.all(promises);
      } catch (e) {
        console.warn("Some image failed to load");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAvatars();

    return () => {
      isMounted = false;
    };
  }, []);

  return { members: TEAM_MEMBERS, isLoading };
}
