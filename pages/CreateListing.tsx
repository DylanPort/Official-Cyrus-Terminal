import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Navbar from '../components/Navbar';
import { BasicInformationForm } from '@/components/listing/BasicInformationForm';
import { AdditionalInformationForm } from '@/components/listing/AdditionalInformationForm';
import { ListingFormActions } from '@/components/listing/ListingFormActions';
import { useListingForm } from '@/hooks/useListingForm';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CreateListing = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { toast } = useToast();
  const {
    formData,
    isSubmitting,
    handleFormDataChange,
    handleImageChange,
    handleSubmit,
  } = useListingForm();

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace')}
            className="mb-8 hover:bg-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
          </Button>

          <Card className="max-w-4xl mx-auto p-8 text-center">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-mint animate-neon-pulse">
              Connect Your Wallet
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Please connect your wallet to create a listing
            </p>
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-8 hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Button>

        <Card className="max-w-4xl mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-mint animate-neon-pulse">
            Create New Listing
          </h1>

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <BasicInformationForm
                formData={formData}
                onFormDataChange={handleFormDataChange}
                onImageChange={handleImageChange}
              />

              <AdditionalInformationForm
                formData={formData}
                onFormDataChange={handleFormDataChange}
              />

              <ListingFormActions isSubmitting={isSubmitting} />
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default CreateListing;