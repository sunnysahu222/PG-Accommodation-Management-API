import { usePendingPgs, useReviewPg } from '../../hooks/useAdmin';
import Button from '../../components/Button';

export default function AdminListings() {
  const { data: pgs, isLoading } = usePendingPgs();
  const review = useReviewPg();

  if (isLoading) return <p className="text-gray-500">Loading pending listings...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Pending PG Listings</h1>

      {!pgs?.length ? (
        <p className="text-gray-500">No listings waiting for approval. 🎉</p>
      ) : (
        <div className="space-y-4">
          {pgs.map((pg) => (
            <div key={pg.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{pg.name}</p>
                <p className="text-sm text-gray-500">{pg.city}, {pg.state} — submitted by {pg.owner?.user?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" isLoading={review.isPending} onClick={() => review.mutate({ id: pg.id, status: 'APPROVED' })}>
                  Approve
                </Button>
                <Button variant="danger" isLoading={review.isPending} onClick={() => review.mutate({ id: pg.id, status: 'REJECTED' })}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
