export function clientOnly(req, res, next) {
     if (req.user.role !== 'client') {
        logger.error('Path is made for clients only')
        return res.status(403).json({ message: "Access denied: Clients only" });
      }
      next();
}