/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';

const GOOGLE_FIT_SCOPES = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read';

export const useGoogleFit = (onDataFetched: (steps: number, calories: number) => void) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncData = useCallback(async () => {
    setIsSyncing(true);
    setError(null);

    try {
      // In a real environment, you'd use the Client ID from set_up_oauth
      // For this demo/applet, we'll implement the flow that triggers the Google OAuth popup
      
      // @ts-ignore
      const client = window.google?.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
        scope: GOOGLE_FIT_SCOPES,
        callback: async (response: any) => {
          if (response.error) {
            setError(response.error);
            setIsSyncing(false);
            return;
          }

          const accessToken = response.access_token;
          await fetchFitData(accessToken);
        },
      });

      if (client) {
        client.requestAccessToken();
      } else {
        throw new Error('Google Identity Services not loaded');
      }
    } catch (err: any) {
      setError(err.message);
      setIsSyncing(false);
    }
  }, []);

  const fetchFitData = async (token: string) => {
    try {
      const now = new Date();
      const startTimeMillis = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const endTimeMillis = now.getTime();

      const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            { dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps" },
            { dataSourceId: "derived:com.google.calories.burned:com.google.android.gms:merged" }
          ],
          bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis,
        }),
      });

      const data = await response.json();
      
      let steps = 0;
      let calories = 0;

      if (data.bucket && data.bucket[0] && data.bucket[0].dataset) {
        data.bucket[0].dataset.forEach((ds: any) => {
          if (ds.point && ds.point[0] && ds.point[0].value && ds.point[0].value[0]) {
            if (ds.dataSourceId.includes('step_count')) {
              steps = ds.point[0].value[0].intVal || 0;
            } else if (ds.dataSourceId.includes('calories')) {
              calories = Math.round(ds.point[0].value[0].fpVal || 0);
            }
          }
        });
      }

      onDataFetched(steps, calories);
      setIsSyncing(false);
    } catch (err: any) {
      setError(err.message);
      setIsSyncing(false);
    }
  };

  return { syncData, isSyncing, error };
};
