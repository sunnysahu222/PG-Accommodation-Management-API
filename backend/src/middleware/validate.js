// Generic middleware factory: pass it a Zod schema, get back an Express middleware.
// This is one function that validates ANY route's body, instead of writing
// custom validation logic per-route.
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data; // use the parsed/typed data going forward
    next();
  };
}
