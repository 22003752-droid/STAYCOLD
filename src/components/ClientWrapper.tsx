"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import { useStore } from "../store/useStore";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fetchProducts = useStore((state) => state.fetchProducts);
  const fetchCategories = useStore((state) => state.fetchCategories);
  const fetchBrands = useStore((state) => state.fetchBrands);
  const fetchSettings = useStore((state) => state.fetchSettings);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchSettings();
  }, [fetchProducts, fetchCategories, fetchBrands, fetchSettings]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleReveal = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observer = new IntersectionObserver(handleReveal, observerOptions);
    
    // Función para observar todos los elementos .reveal actuales
    const observeReveals = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(el => observer.observe(el));
    };

    // Observar elementos existentes inicialmente
    observeReveals();

    // Configurar MutationObserver para detectar nuevos elementos .reveal agregados al DOM
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReobserve = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          shouldReobserve = true;
        }
      });
      if (shouldReobserve) {
        observeReveals();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]); // Re-run when page changes

  return <SessionProvider>{children}</SessionProvider>;
}
