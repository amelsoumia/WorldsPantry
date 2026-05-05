// Simple recommendation algorithm
class RecommendationService {

    static sortRecipes(recipes, countryPrefs, dietaryPrefs) {

        const countryIds = countryPrefs.map(c => c.country_id);
        const dietaryIds = dietaryPrefs.map(d => d.dietary_id);

        return recipes
            .map(recipe => {
                let score = 0;

                if (countryIds.includes(recipe.country_id)) {
                    score += 5;
                }

                if (recipe.dietary_tags) {
                    for (const tag of recipe.dietary_tags) {
                        if (dietaryIds.includes(tag.dietary_id)) {
                            score += 3;
                        }
                    }
                }

                return { ...recipe, score };
            })
            .sort((a, b) => b.score - a.score);
    }
}

module.exports = RecommendationService;