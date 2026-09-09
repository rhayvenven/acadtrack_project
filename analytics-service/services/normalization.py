def normalize_grade(raw_value, scale_type, best_value, worst_value):
    """
    Converts a raw grade (in whatever scale a school uses) into a 
    normalized 0-100 score, where 100 always means "best possible."
    """
    if scale_type == "inverted":
        normalized = 100 * (worst_value - raw_value) / (worst_value - best_value)
    else:
        normalized = 100 * (raw_value - worst_value) / (best_value - worst_value)

    return round(normalized, 2)
