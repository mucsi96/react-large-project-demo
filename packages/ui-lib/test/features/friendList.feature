Feature: Friend List

    Feature Description

    Scenario: Show the list of friends
    Given I open the friends list
    Then I see the list of friends

    Scenario: Show empty message if there are no friends
    Given I have no friends
    And I open the friends list
    Then I see "No friends found :(" message

    Scenario: Show error message if fetching friends fails
    Given The friends endpoint fails
    And I open the friends list
    Then I see "Failed to load friends" message
