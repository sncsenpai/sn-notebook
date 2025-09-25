/*
 * Name: Automatically retire the articles
 * Run: Daily
 * Usage: Scheduled script run out-of-hours
 */
(function() {
    var grKnowledgeArticle = new GlideRecord('kb_knowledge');
    grKnowledgeArticle.addQuery('workflow_state', 'published');
    grKnowledgeArticle.addQuery('valid_to', '<', gs.daysAgoStart(0));
    grKnowledgeArticle.query();

    while (grKnowledgeArticle.next()) {
        // Determine app version
        var sVersion = grKnowledgeArticle.kb_knowledge_base.kb_version.toString();

        // Using switch for future proofing
        switch (sVersion) {
            case '3':
                // KMv3: Retire using the workflow of the Knowledge base
                new KBWorkflow().startWorkflow(grKnowledgeArticle, "retire_workflow");
                break;

            case '2':
                // Version 2 or before
                grKnowledgeArticle.workflow_state = 'retired';
                break;
            default:
                gs.error("Error retiring ${0}. Cannot determine app version.", grKnowledgeArticle.getDisplayValue());
        }
        grKnowledgeArticle.update();
    }
})();
