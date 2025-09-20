import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../auth/firebase';

/**
 * Fetches the total count of users from Firestore directly (frontend)
 * @returns Promise<number> - Total number of users
 */
export async function fetchTotalUsersCount(): Promise<number> {
  try {
    const usersCollection = collection(db, 'userProfiles');
    const snapshot = await getCountFromServer(usersCollection);
    // ✅ Correct way:
    const count = snapshot.data().count;
    return count;
  } catch (error) {
    console.error('Error fetching total users count:', error);
    throw new Error('Failed to fetch total users count');
  }
}

/**
 * Fetches detailed user statistics
 * @returns Promise<{total: number, verified: number, completed: number}>
 */
export async function fetchUserStats(): Promise<{
  total: number;
  verified: number; 
  completed: number;
}> {
  try {
    const usersCollection = collection(db, 'userProfiles');

    // Total count
    const totalSnapshot = await getCountFromServer(usersCollection);
    const total = totalSnapshot.data().count;

    // Verified count
    const verifiedQuery = query(usersCollection, where("verified", "==", true));
    const verifiedSnapshot = await getCountFromServer(verifiedQuery);
    const verified = verifiedSnapshot.data().count;

    // Completed count
    const completedQuery = query(usersCollection, where("completed", "==", true));
    const completedSnapshot = await getCountFromServer(completedQuery);
    const completed = completedSnapshot.data().count;

    return { total, verified, completed };
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw new Error('Failed to fetch user statistics');
  }
}
