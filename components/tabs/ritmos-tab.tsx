"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Check, Flame, Droplets, Moon, Dumbbell, BookOpen, Trash2, GripVertical, Coffee, Utensils, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNeuroCoach, Habit } from "@/lib/neurocoach-context"
import { useI18n } from "@/lib/i18n"

// Icon map for dynamic rendering
const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  Moon: <Moon className="h-5 w-5" />,
  Dumbbell: <Dumbbell className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />,
  Utensils: <Utensils className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
}

interface SortableHabitCardProps {
  habit: Habit
  onToggle: () => void
  onDelete: () => void
}

function SortableHabitCard({ habit, onToggle, onDelete }: SortableHabitCardProps) {
  const { t } = useI18n()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all",
        isDragging && "z-50 shadow-lg ring-2 ring-primary opacity-90",
        habit.completedToday
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30"
          : "border-border"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Icon */}
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-white",
          habit.color
        )}
      >
        {iconMap[habit.icon] || <Flame className="h-5 w-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium truncate",
          habit.completedToday && "line-through text-muted-foreground"
        )}>
          {habit.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {habit.streak} {t("days")} streak
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
        aria-label={t("delete")}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Complete button */}
      <button
        onClick={onToggle}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
          habit.completedToday
            ? "border-green-500 bg-green-500 text-white"
            : "border-muted-foreground/30 text-muted-foreground/30 hover:border-primary hover:text-primary"
        )}
        aria-label={habit.completedToday ? t("completed") : t("markComplete")}
      >
        <Check className="h-5 w-5" />
      </button>
    </div>
  )
}

export function RitmosTab() {
  const { habits, toggleHabitCompletion, removeHabit, reorderHabits, getCompletedTodayCount } = useNeuroCoach()
  const { t } = useI18n()
  
  const completedCount = getCompletedTodayCount()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      reorderHabits(active.id as string, over.id as string)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t("myRhythms")}</h2>
          <span className="text-sm text-muted-foreground">{completedCount}/{habits.length} {t("completed")}</span>
        </div>

        {habits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 bg-muted/50 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Flame className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noHabits")}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              {t("startChatHint")}
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {habits.map((habit) => (
                  <SortableHabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={() => toggleHabitCompletion(habit.id)}
                    onDelete={() => removeHabit(habit.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm text-primary">
            <span className="font-medium">Tip:</span> {t("startChatHint")}
          </p>
        </div>
      </div>
    </div>
  )
}
