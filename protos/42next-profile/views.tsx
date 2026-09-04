import type { ProtoView } from "../../src/proto-types"
import { Activity } from "./pages/activity"
import { Profile } from "./pages/profile"

export const VIEWS: ProtoView[] = [
  {
    path: "profile/:login",
    label: "Learner profile",
    href: "#/profile/aserrano",
    render: ({ login }) => <Profile login={login} />,
  },
  {
    path: "activities/:slug",
    label: "Activity",
    href: "#/activities/minishell",
    render: ({ slug }) => <Activity slug={slug} />,
  },
]
