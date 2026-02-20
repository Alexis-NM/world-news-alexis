import type { NextFunction, Request, Response } from "express";
import type Joi from "joi";

const validate = (
	schema: Joi.ObjectSchema,
	property: "body" | "params" | "query" = "body",
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error, value } = schema.validate(req[property], {
			abortEarly: false,
			stripUnknown: true,
		});

		if (error) {
			const errors = error.details.map((detail) => ({
				field: detail.path.join("."),
				message: detail.message,
			}));

			res.status(400).json({
				error: "Erreur de validation",
				details: errors,
			});
			return;
		}

		req[property] = value;
		next();
	};
};

export default validate;
