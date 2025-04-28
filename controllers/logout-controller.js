export const logoutUser = (req, res) => {
    // In a stateless JWT system, logout is primarily handled client-side
    // by deleting the token.
    // This endpoint exists for convention and potential future use (e.g., blocklisting).
    const userId = req.user ? req.user.id : 'Unknown (no token?)'; // Get user ID if authenticated
    logger.info(`Logout requested for user ID: ${userId}`);
    res.json({ message: 'Logout successful. Please discard your token.' });
  }; 
  