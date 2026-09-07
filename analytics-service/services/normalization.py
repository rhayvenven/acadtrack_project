def normalize_grade(raw_value, scale_type, best_value, worst_value):
    if scale_type == "inverted":
        normalized = 100 * (worst_value - raw_value) / (worst_value - best_value)
    else:
        normalized = 100 * (raw_value - worst_value) / (best_value - worst_value)

    return round(normalized, 2)
