"use client";

import { useRestaurant } from "@/context/RestaurantContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Store, Check } from "lucide-react";

export function RestaurantSwitcher() {
  const { restaurants, activeRestaurant, setActiveRestaurant, isLoading } =
    useRestaurant();

  if (isLoading) {
    return (
      <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
        Carregando...
      </Button>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
        <a href="/admin/settings">Criar restaurante</a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between"
          aria-label="Selecionar restaurante"
        >
          <span className="flex items-center gap-2 truncate">
            <Store className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {activeRestaurant?.name || "Selecionar restaurante"}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Meus Restaurantes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {restaurants.map((restaurant) => (
          <DropdownMenuItem
            key={restaurant.id}
            onClick={() => setActiveRestaurant(restaurant)}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2 w-full">
              <span className="truncate flex-1">{restaurant.name}</span>
              {activeRestaurant?.id === restaurant.id && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-primary" asChild>
          <a href="/admin/settings">Gerenciar restaurantes</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}