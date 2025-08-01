import { DeliveryManager } from '@/components/delivery-manager';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DeliveryManager />
      </main>
    </>
  );
}
