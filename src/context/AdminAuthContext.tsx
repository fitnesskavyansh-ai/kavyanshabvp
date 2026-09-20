const verifyAdminStatus = async (currentUser: User): Promise<boolean> => {
  try {
    // Normalize UID values to prevent hidden whitespace/BOM characters
    const normalizeUid = (value: unknown): string =>
      String(value ?? '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();

    const currentUid = normalizeUid(currentUser.uid);
    const authorizedUid = normalizeUid(CONFIGURED_ADMIN_UID);

    console.log('[AdminAuth] Current UID:', JSON.stringify(currentUid));
    console.log('[AdminAuth] Authorized UID:', JSON.stringify(authorizedUid));
    console.log('[AdminAuth] Current UID length:', currentUid.length);
    console.log('[AdminAuth] Authorized UID length:', authorizedUid.length);

    const authorized =
      currentUid.length > 0 &&
      authorizedUid.length > 0 &&
      currentUid === authorizedUid;

    setIsAdmin(authorized);

    // Fetch Firebase token claims for diagnostics
    try {
      const tokenResult: IdTokenResult =
        await currentUser.getIdTokenResult(false);

      setClaims(tokenResult.claims);
    } catch {
      setClaims(null);
    }

    if (!authorized) {
      if (!authorizedUid) {
        setAuthError(
          `Configuration Required: VITE_ADMIN_UID is not set. Set VITE_ADMIN_UID="${currentUid}" in your environment variables.`
        );
      } else {
        setAuthError(
          `Access Denied: Your account (${currentUser.email}, UID: ${currentUid}) is not the authorized administrator UID.`
        );
      }
    } else {
      setAuthError(null);
    }

    return authorized;
  } catch (err: any) {
    console.error('[AdminAuth] Error verifying admin UID:', err);

    setIsAdmin(false);
    setClaims(null);
    setAuthError(
      err.message || 'Failed to verify admin authorization'
    );

    return false;
  }
};
