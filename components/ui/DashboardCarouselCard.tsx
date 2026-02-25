'use client';
import type { ReactNode } from 'react';
import { Carousel, Card, IconButton, Skeleton } from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createListCollection } from '@chakra-ui/react';

export interface TimeRangeSelectConfig {
  collection: { items: Array<{ value: string; label: string }> };
  value: string;
  onValueChange: (value: string) => void;
}

export interface DashboardCarouselCardProps<T> {
  title: string;
  select?: TimeRangeSelectConfig;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  items: T[];
  itemsPerSlide?: number;
  skeletonCount?: number;
  renderSlide: (slideItems: T[]) => ReactNode;
}

const defaultSkeletonCount = 7;
const defaultItemsPerSlide = 7;

export function DashboardCarouselCard<T>({
  title,
  select,
  isLoading,
  isError,
  errorMessage,
  items,
  itemsPerSlide = defaultItemsPerSlide,
  skeletonCount = defaultSkeletonCount,
  renderSlide,
}: DashboardCarouselCardProps<T>) {
  const slideCount = Math.max(1, Math.ceil(items.length / itemsPerSlide));
  const slides = Array.from({ length: slideCount }, (_, i) => i);
  const itemSlides = slides.map((slide) =>
    items.slice(slide * itemsPerSlide, (slide + 1) * itemsPerSlide)
  );

  return (
    <Card.Root
      variant="elevated"
      className="p-4 w-full flex flex-col gap-4"
      bg={{ base: 'white', _dark: 'gray.800' }}
    >
      <div>
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        {select && (
          <SelectRoot
            collection={createListCollection({
              items: select.collection.items,
            })}
            size="sm"
            variant="subtle"
            value={[select.value]}
            onValueChange={(e) => select.onValueChange(e.value[0] ?? '')}
          >
            <SelectTrigger>
              <SelectValueText />
            </SelectTrigger>
            <SelectContent>
              {select.collection.items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )}
      </div>

      {isLoading && (
        <div className="flex gap-4 flex-row w-full">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square w-full h-full flex-1"
              borderRadius="md"
              bg={{ base: 'gray.200', _dark: 'gray.700' }}
              style={{
                animationDelay: `${index * 60}ms`,
                animationDuration: '1.2s',
                animationFillMode: 'both',
              }}
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-4 text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {!isLoading && !isError && (
        <Carousel.Root slideCount={slideCount}>
          <Carousel.Control justifyContent="center" gap="4">
            <Carousel.PrevTrigger asChild>
              <IconButton size="xs" variant="outline">
                <ChevronLeft />
              </IconButton>
            </Carousel.PrevTrigger>
            <Carousel.ItemGroup width="full">
              {itemSlides.map((slideItems, index) => (
                <Carousel.Item key={index} index={index}>
                  {renderSlide(slideItems)}
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>
            <Carousel.NextTrigger asChild>
              <IconButton size="xs" variant="outline">
                <ChevronRight />
              </IconButton>
            </Carousel.NextTrigger>
          </Carousel.Control>
        </Carousel.Root>
      )}
    </Card.Root>
  );
}
