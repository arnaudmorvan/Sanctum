/** The kit, RENDERED — what goes next to the Figma frame in the Parity tab.
 *
 *  The comparison could have been two tables of prop names side by side. It would have
 *  answered "do the axes match" and never "does the built thing look like the drawn
 *  thing", which is the question a designer opens this tab with. So the right-hand side
 *  mounts the real `@42/ui-react` component, in this browser, from the same package a
 *  flow is built with.
 *
 *  ## Why these are written by hand, one per component
 *
 *  `ui-manifest.json` carries a `snippet` (`<Badge variant="light" />`) and it is not
 *  enough to render anything: `Select` needs options, `Tooltip` needs a child, `Table`
 *  is a namespace of parts. There is no generic way to instantiate sixty-two components —
 *  a generated preview is either empty or throws. So each one is written, with the
 *  smallest content that shows what the component IS.
 *
 *  ⚠️ **A component with no entry here shows as "no preview", never as a blank cell.**
 *  Same rule as `gen-ui-manifest.py`: an empty field means "not found", never "deduced".
 *  A silently blank preview beside a Figma frame reads as "the kit renders nothing",
 *  which is a lie about the kit.
 *
 *  ## The error boundary is not defensive clutter
 *
 *  These previews call an API this file does not compile against component by component —
 *  the kit moves, a required prop appears, a namespace part is renamed. Without a boundary
 *  ONE such change blanks the whole tab, and the tab is the thing that was supposed to
 *  tell you the kit moved. With it, the cell says which component stopped rendering, and
 *  every other pair still reads.
 */
import { ActionIcon } from "@42/ui-react/action-icon"
import { Alert } from "@42/ui-react/alert"
import { Autocomplete } from "@42/ui-react/autocomplete"
import { Avatar, AvatarGroup } from "@42/ui-react/avatar"
import { Badge } from "@42/ui-react/badge"
import { Breadcrumb } from "@42/ui-react/breadcrumb"
import { Button } from "@42/ui-react/button"
import { ButtonGroup } from "@42/ui-react/button-group"
import { Calendar } from "@42/ui-react/calendar"
import { Card } from "@42/ui-react/card"
import { Checkbox } from "@42/ui-react/checkbox"
import { ChoiceCardGroup } from "@42/ui-react/choice-card-group"
import { CircularProgress } from "@42/ui-react/circular-progress"
import { Collapse } from "@42/ui-react/collapse"
import { ComboboxList } from "@42/ui-react/combobox-list"
import { DatePicker } from "@42/ui-react/date-picker"
import { Divider } from "@42/ui-react/divider"
import { Field } from "@42/ui-react/field"
import { FileUpload } from "@42/ui-react/file-upload"
import { Input } from "@42/ui-react/input"
import { Kbd } from "@42/ui-react/kbd"
import { Menu } from "@42/ui-react/menu"
import { MultiComboboxList } from "@42/ui-react/multi-combobox-list"
import { MultiSelect } from "@42/ui-react/multi-select"
import { NavLink } from "@42/ui-react/nav-link"
import { Notification } from "@42/ui-react/notification"
import { NumberInput } from "@42/ui-react/number-input"
import { PasswordInput } from "@42/ui-react/password-input"
import { Pill } from "@42/ui-react/pill"
import { PinInput } from "@42/ui-react/pin-input"
import { Progress } from "@42/ui-react/progress"
import { RadioGroup } from "@42/ui-react/radio-group"
import { SegmentGroup } from "@42/ui-react/segment-group"
import { Select } from "@42/ui-react/select"
import { Skeleton } from "@42/ui-react/skeleton"
import { Slider } from "@42/ui-react/slider"
import { Spinner } from "@42/ui-react/spinner"
import { Switch } from "@42/ui-react/switch"
import { Table } from "@42/ui-react/table"
import { Tabs } from "@42/ui-react/tabs"
import { TagsInput } from "@42/ui-react/tags-input"
import { Text } from "@42/ui-react/text"
import { Textarea } from "@42/ui-react/textarea"
import { ThemeIcon } from "@42/ui-react/theme-icon"
import { TimeInput } from "@42/ui-react/time-input"
import { Timeline } from "@42/ui-react/timeline"
import { Title } from "@42/ui-react/title"
import { Tooltip } from "@42/ui-react/tooltip"
import { TreeMultiSelect } from "@42/ui-react/tree-multi-select"
import { TreeSelect } from "@42/ui-react/tree-select"
import { Bell, Check, Star } from "lucide-react"
import { Component, type ErrorInfo, type ReactNode } from "react"

const OPTIONS = ["Piscine", "Common core", "Specialisation"]
const TREE = [
  { value: "cursus", label: "Cursus", children: [{ value: "c-piscine", label: "Piscine" }] },
]

/** A preview takes the props of ONE point in the component's variant space.
 *
 *  Zero-argument at first, which was enough beside a Figma frame and useless for the
 *  coverage grid: a grid cell is `variant="outline" color="red" size="md"`, and the whole
 *  point is to see those side by side. `Record<string, unknown>` rather than a typed prop
 *  bag on purpose — the axes come from the catalogues at runtime, and there is no type
 *  here that could describe sixty-two different components' props.
 *
 *  ⚠️ `{...p}` is spread LAST in every entry, and that ordering is load-bearing: `Alert`'s
 *  preview sets `type="info"` for the card, and a grid whose rows ARE the `type` axis must
 *  win over it. Spread first, every row of that grid would have rendered `info`. */
export type Preview = (props?: Record<string, unknown>) => ReactNode

/** Written previews, keyed by the React component's name — the same key the parity report
 *  pairs on. The content is the SMALLEST thing that shows what the component is: a Select
 *  gets three options because one would not show it is a list, and no more because the
 *  cell sits beside a Figma frame, not on a documentation page. */
export const PREVIEWS: Record<string, Preview> = {
  ActionIcon: (p) => (
    <ActionIcon aria-label="Notifications" {...p}>
      <Bell size={16} />
    </ActionIcon>
  ),
  Alert: (p) => <Alert type="info" title="Breaking change in v3" description="The theme API changed."  {...p}/>,
  Autocomplete: (p) => <Autocomplete data={OPTIONS} placeholder="Search a cursus"  {...p}/>,
  Avatar: (p) => <Avatar name="Amanda Lowery"  {...p}/>,
  AvatarGroup: (p) => (
    <AvatarGroup {...p}>
      <Avatar name="Amanda Lowery" />
      <Avatar name="Adil Floyd" />
      <Avatar name="Alec Whitten" />
    </AvatarGroup>
  ),
  Badge: (p) => <Badge {...p}>Label</Badge>,
  Breadcrumb: (p) => (
    <Breadcrumb data={[{ label: "Cursus", href: "#" }, { label: "Piscine", href: "#" }, { label: "C05" }]}  {...p}/>
  ),
  Button: (p) => <Button {...p}>Button</Button>,
  ButtonGroup: (p) => (
    <ButtonGroup {...p}>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
    </ButtonGroup>
  ),
  Calendar: (p) => <Calendar  {...p}/>,
  Card: (p) => (
    <Card {...p}>
      <Text size="sm">A card, at its default padding.</Text>
    </Card>
  ),
  Checkbox: (p) => <Checkbox label="Remember me"  {...p}/>,
  ChoiceCardGroup: (p) => <ChoiceCardGroup data={["Solo", "Team"]}  {...p}/>,
  CircularProgress: (p) => <CircularProgress value={62}  {...p}/>,
  Collapse: (p) => (
    <Collapse open {...p}>
      <Text size="sm">Open content.</Text>
    </Collapse>
  ),
  ComboboxList: (p) => <ComboboxList data={OPTIONS} placeholder="Pick one"  {...p}/>,
  DatePicker: (p) => <DatePicker  {...p}/>,
  Divider: (p) => <Divider label="or"  {...p}/>,
  Field: (p) => (
    <Field label="E-mail" description="We never share it." {...p}>
      <Input placeholder="you@42.fr" />
    </Field>
  ),
  FileUpload: (p) => <FileUpload  {...p}/>,
  Input: (p) => <Input placeholder="Placeholder"  {...p}/>,
  Kbd: (p) => <Kbd {...p}>⌘K</Kbd>,
  Menu: (p) => <Menu data={["Rename", "Duplicate", "Delete"]} {...p}><Button variant="outline">Open menu</Button></Menu>,
  MultiComboboxList: (p) => <MultiComboboxList data={OPTIONS} placeholder="Pick several"  {...p}/>,
  MultiSelect: (p) => <MultiSelect data={OPTIONS} placeholder="Pick several"  {...p}/>,
  NavLink: (p) => <NavLink label="Dashboard" icon={<Star size={16} />}  {...p}/>,
  Notification: (p) => <Notification type="success" title="Saved" description="Your changes are live."  {...p}/>,
  NumberInput: (p) => <NumberInput defaultValue={3}  {...p}/>,
  PasswordInput: (p) => <PasswordInput placeholder="••••••••"  {...p}/>,
  Pill: (p) => <Pill withRemoveButton {...p}>Piscine</Pill>,
  PinInput: (p) => <PinInput length={4}  {...p}/>,
  Progress: (p) => <Progress value={62}  {...p}/>,
  RadioGroup: (p) => <RadioGroup data={OPTIONS}  {...p}/>,
  SegmentGroup: (p) => <SegmentGroup data={["Day", "Week", "Month"]}  {...p}/>,
  Select: (p) => <Select data={OPTIONS} placeholder="Pick one"  {...p}/>,
  Skeleton: (p) => <Skeleton className="h-4 w-40"  {...p}/>,
  Slider: (p) => <Slider defaultValue={[40]}  {...p}/>,
  Spinner: (p) => <Spinner  {...p}/>,
  Switch: (p) => <Switch label="Notifications"  {...p}/>,
  // ⚠️ `Table` is the SHELL (a div, with room for a title and a toolbar); `Table.Content`
  // is the `<table>`. Putting `Table.Head` straight under the root put a `<thead>` inside
  // a `<div>` — invalid HTML, and React said so in the console on every render.
  Table: (p) => (
    <Table {...p}>
      <Table.Content>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Project</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>libft</Table.Cell>
            <Table.Cell>
              <Badge>Passed</Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  ),
  Tabs: (p) => (
    <Tabs
      data={[
        { value: "overview", label: "Overview", content: <Text size="sm">Overview</Text> },
        { value: "activity", label: "Activity", content: <Text size="sm">Activity</Text> },
      ]}
     {...p}/>
  ),
  TagsInput: (p) => <TagsInput defaultValue={["C", "Unix"]}  {...p}/>,
  Text: (p) => <Text {...p}>The quick brown fox.</Text>,
  Textarea: (p) => <Textarea placeholder="Say something"  {...p}/>,
  ThemeIcon: (p) => (
    <ThemeIcon {...p}>
      <Check size={16} />
    </ThemeIcon>
  ),
  TimeInput: (p) => <TimeInput  {...p}/>,
  Timeline: (p) => (
    <Timeline {...p}>
      <Timeline.Item>
        <Timeline.Title>Registered</Timeline.Title>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Title>Piscine</Timeline.Title>
      </Timeline.Item>
    </Timeline>
  ),
  Title: (p) => <Title size="lg" {...p}>A title</Title>,
  Tooltip: (p) => (
    <Tooltip label="A tooltip" {...p}>
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
  TreeMultiSelect: (p) => <TreeMultiSelect data={TREE} placeholder="Pick several"  {...p}/>,
  TreeSelect: (p) => <TreeSelect data={TREE} placeholder="Pick one"  {...p}/>,
}

/** Components that are deliberately NOT previewed, and why. Written down rather than
 *  left out: "no preview" and "nothing to preview" are two different statements, and a
 *  reader comparing catalogues deserves the second one where it is true. */
export const NOT_PREVIEWABLE: Record<string, string> = {
  AppShell: "Page chrome — it owns the whole viewport; a cell cannot show it.",
  AmbientBackground: "A full-page background layer: it has nothing to show at this size.",
  ThemeScript: "A <script> that sets the theme before paint. It renders no pixels.",
  Container: "A layout primitive: a max-width and margins, invisible in isolation.",
  Flex: "A layout primitive: it is its children's arrangement, nothing of its own.",
  Grid: "A layout primitive: it is its children's arrangement, nothing of its own.",
  Modal: "An overlay: it takes the viewport. Open it from the Figma frame's variants.",
  Drawer: "An overlay: it takes the edge of the viewport.",
  Popover: "An overlay, positioned against a trigger that is not in this cell.",
  Combobox: "The composable primitive under ComboboxList — used through it.",
  PillsInput: "The composable shell of TagsInput and MultiSelect — used through them.",
  DataTable: "Needs real columns and rows: a preview of it is a screen, not a cell.",
}

type BoundaryProps = { name: string; children: ReactNode }
type BoundaryState = { error: string }

/** One preview that throws must not take the tab with it. The message names the component
 *  and keeps the error text: this cell going red IS a finding — the kit's API moved under
 *  a preview written against the older one. */
export class PreviewBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: "" }

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return { error: error instanceof Error ? error.message : String(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[parity] preview of ${this.props.name} failed`, error, info)
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        // `data-preview-error`: the surface measure reads it to skip a variant whose
        // render threw, instead of measuring the error message's own box.
        <div data-preview-error="" className="text-xs text-orange-400">
          This preview no longer renders — the kit's API moved under it.
          <div className="mt-1 font-mono text-[11px] break-words opacity-70">{this.state.error}</div>
        </div>
      )
    }
    return this.props.children
  }
}
