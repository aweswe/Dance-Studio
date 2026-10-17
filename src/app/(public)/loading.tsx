import { PublicPageSkeleton } from "@/components/public/public-page-skeleton";

export default function PublicLoading() {
  return <PublicPageSkeleton hasHeader={true} cardCount={3} columns={3} />;
}

