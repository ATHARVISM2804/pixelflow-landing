import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/auth/AuthContext';

// Firebase imports
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../auth/firebase';

interface UserProfile {
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    profileComplete: boolean;
}

const CompleteSignup: React.FC<{ onSkip?: () => void }> = ({ onSkip }) => {
    const [formData, setFormData] = useState<UserProfile>({
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        profileComplete: false,
    });
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    // Store the previous page URL
    const [prevPage, setPrevPage] = useState<string | null>(null);

    useEffect(() => {
        // Save the previous page on mount
        setPrevPage(document.referrer || window.history.state?.usr?.from || null);
        // If user is already logged in, pre-fill email
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || '',
            }));

            // Check if the user profile is already completed
            checkProfileCompletion();
        }
    }, [user]);

    const checkProfileCompletion = async () => {
        if (!user) return;

        try {
            const userProfileRef = doc(db, "userProfiles", user.uid);
            const profileSnap = await getDoc(userProfileRef);

            if (profileSnap.exists() && profileSnap.data().profileComplete) {
                // Profile is already complete
                toast({
                    title: "Profile Already Complete",
                    description: "Your profile information is already set up.",
                });
                if (onSkip) onSkip();
            } else if (profileSnap.exists()) {
                // Profile exists but not complete, pre-fill data
                const data = profileSnap.data() as UserProfile;
                setFormData(data);
                if (data.dateOfBirth) {
                    setDate(new Date(data.dateOfBirth));
                }
            }
        } catch (error) {
            console.error("Error checking profile:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setFormData({
                ...formData,
                dateOfBirth: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            if (!formData.phoneNumber || !formData.dateOfBirth || !formData.address) {
                throw new Error("Please fill all required fields");
            }

            // Save user profile data to Firestore
            const userProfileRef = doc(db, "userProfiles", user.uid);
            await setDoc(userProfileRef, {
                ...formData,
                profileComplete: true,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            toast({
                title: "Profile Updated",
                description: "Your profile information has been saved successfully.",
            });

            // Redirect or callback
            if (onSkip) {
                onSkip();
            } else if (prevPage) {
                window.location.href = prevPage;
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Error saving profile:", err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : 'Failed to update profile',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto p-6 bg-gray-900/70 rounded-lg shadow-xl border border-gray-800/60">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Complete Your Profile</h2>
                <p className="text-sm text-gray-400 mb-6 text-center">
                    Please provide additional information to continue.
                </p>

                {error && <div className="p-3 mb-4 text-sm text-red-200 bg-red-600/20 border border-red-400 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-white">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!!user?.email}
                                className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <Label htmlFor="phoneNumber" className="text-white">Phone Number<span className="text-red-500">*</span></Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                required
                                className="mt-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <Label htmlFor="dateOfBirth" className="text-white">Date of Birth<span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="dateOfBirth"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal mt-1 bg-gray-800/50 border-gray-700/50 text-white",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white border-gray-200 text-black">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                        captionLayout="dropdown-buttons"
                                        fromYear={1900}
                                        toYear={new Date().getFullYear()}
                                        classNames={{
                                            day_selected: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                                            day_today: "bg-gray-100 text-gray-900",
                                            day: "h-9 w-9 p-0 font-normal",
                                            day_disabled: "text-gray-400 opacity-50",
                                            day_outside: "text-gray-400 opacity-50",
                                            head_cell: "text-gray-500 font-semibold",
                                            caption: "flex justify-center pt-1 pb-2 px-2",
                                            caption_label: "hidden",
                                            dropdown: "p-1 bg-white text-gray-900 border border-gray-200 rounded shadow",
                                            cell: "text-center text-sm p-0 relative",
                                            nav_button: "border border-gray-200 bg-white hover:bg-gray-100 rounded p-1",
                                            nav_button_previous: "absolute left-1",
                                            nav_button_next: "absolute right-1",
                                            table: "w-full border-collapse",
                                            root: "p-2"
                                        }}
                                    />
                                    <div className="p-2 flex justify-between border-t border-gray-200">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setDate(undefined)} 
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Clear
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setDate(new Date())} 
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Today
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <Label htmlFor="address" className="text-white">Address<span className="text-red-500">*</span></Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter your full address"
                                required
                                className="mt-1 min-h-[100px] bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-1/2 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
                            onClick={handleSkip}
                        >
                            Skip for Now
                        </Button>
                        <Button
                            type="submit"
                            className="w-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        You can always update your profile information later from your account settings.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CompleteSignup;
